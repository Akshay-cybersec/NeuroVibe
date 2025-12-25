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

@app.websocket("/ws/{room_id}/{role}")
async def websocket_endpoint(ws: WebSocket, room_id: str, role: str):
    await ws.accept()
    print(f"Connected: {room_id} {role}")

    rooms_ref = db.collection("rooms").document(room_id)

    if role == "sender":
        senders[room_id] = ws
        rooms_ref.update({"sender": True})
    else:
        receivers.setdefault(room_id, []).append(ws)
        rooms_ref.update({"receivers": firestore.Increment(1)})

    try:
        while True:
            data = await ws.receive_json()
            if role == "sender":
                for client in receivers.get(room_id, []):
                    await client.send_json(data)

    except WebSocketDisconnect:
        print(f"Disconnected: {room_id} {role}")

        if role == "sender":
            senders.pop(room_id, None)
            rooms_ref.update({"active": False, "sender": False})
        else:
            receivers[room_id].remove(ws)
            rooms_ref.update({"receivers": firestore.Increment(-1)})
            
            if len(receivers[room_id]) == 0:
                rooms_ref.update({"active": False})

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