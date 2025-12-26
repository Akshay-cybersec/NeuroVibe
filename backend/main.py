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
    print(f"Connected: Room={room_id}, Role={role}")

    if role == "sender":
        senders[room_id] = ws
    else:
        receivers.setdefault(room_id, []).append(ws)

    try:
        while True:
            data = await ws.receive_text()
            message = json.loads(data)

            if message.get("type") == "morse":
                code = message.get("code")
                for client in receivers.get(room_id, []):
                    await client.send_json({
                        "type": "morse",
                        "code": code
                    })
                continue 

            intensity = message.get("payload", {}).get("intensity")
            if role == "sender" and intensity is not None:
                for client in receivers.get(room_id, []):
                    try:
                        await client.send_json({
                            "type": "speech",
                            "payload": {"intensity": intensity}
                        })
                    except:
                        receivers[room_id].remove(client)

    except WebSocketDisconnect:
        print(f"Disconnected: Room={room_id}, Role={role}")

        if role == "sender":
            senders.pop(room_id, None)
            for client in receivers.get(room_id, []):
                try:
                    await client.send_json({"type": "disconnect"})
                except:
                    pass
        else:
            if room_id in receivers and ws in receivers[room_id]:
                receivers[room_id].remove(ws)


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