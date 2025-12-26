from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
cred = credentials.Certificate(json.loads(service_account_json))
firebase_admin.initialize_app(cred)
db = firestore.client()


senders = {}
receivers = {}

@app.get("/")
def root():
    return {"status": "NeuroVibe backend running"}

rooms = {}  

def get_room(room_id):
    if room_id not in rooms:
        rooms[room_id] = {"sender": None, "receivers": []}
    return rooms[room_id]


async def broadcast_users(room_id):
    room = get_room(room_id)

    payload = {
        "type": "users_update",
        "sender": room["sender"]["info"] if room["sender"] else None,
        "receivers": [r["info"] for r in room["receivers"]],
    }

    if room["sender"]:
        await room["sender"]["ws"].send_json(payload)

    for r in room["receivers"]:
        await r["ws"].send_json(payload)


@app.websocket("/ws/{room_id}/{role}")
@app.websocket("/ws/{room_id}/{role}/{uid}")
async def websocket_endpoint(ws: WebSocket, room_id: str, role: str, uid: str = None):
    await ws.accept()

    if not uid:
        uid = f"U{os.urandom(4).hex()}"

    room = get_room(room_id)

    init_data = await ws.receive_text()
    user_info = json.loads(init_data).get("user")

    if role == "sender":
        room["sender"] = {"ws": ws, "info": user_info}
    else:
        room["receivers"].append({"ws": ws, "info": user_info})

    await broadcast_users(room_id)

    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)

            if msg.get("type") == "morse":
                for r in room["receivers"]:
                    await r["ws"].send_json(msg)

    except WebSocketDisconnect:
        if role == "sender":
            room["sender"] = None
        else:
            room["receivers"] = [r for r in room["receivers"] if r["info"]["id"] != uid]

        await broadcast_users(room_id)


@app.get("/rooms")
def list_rooms():
    rooms_ref = db.collection("rooms")
    docs = rooms_ref.stream()

    active_rooms = []
    closed_rooms = []

    for doc in docs:
        data = doc.to_dict()
        room_info = {"room_id": doc.id, **data}

        if data.get("active", False):
            active_rooms.append(room_info)
        else:
            closed_rooms.append(room_info)

    return {
        "active_rooms": active_rooms,
        "closed_rooms": closed_rooms,
        "total": len(active_rooms) + len(closed_rooms)
    }