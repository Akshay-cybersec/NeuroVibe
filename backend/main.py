from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rooms = {}

@app.get("/")
def root():
    return {"status": "NeuroVibe backend running"}

@app.post("/create-room")
def create_room():
    room_id = str(uuid.uuid4())[:6].upper()
    rooms[room_id] = []
    return {"room_id": room_id}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(ws: WebSocket, room_id: str):
    await ws.accept()

    if room_id not in rooms:
        rooms[room_id] = []

    rooms[room_id].append(ws)

    try:
        while True:
            data = await ws.receive_json()

            """
            Expected data format:
            {
              "type": "speech",
              "payload": {
                "intensity": 70,
                "timestamp": 1720000000
              }
            }
            """

            for client in rooms[room_id]:
                if client != ws:
                    await client.send_json(data)

    except WebSocketDisconnect:
        rooms[room_id].remove(ws)


@app.get("/rooms")
def list_rooms():
    return {
        "active_rooms": {
            room_id: len(clients)
            for room_id, clients in rooms.items()
        }
    }

@app.websocket("/ws/{room_id}/{role}")
async def websocket_endpoint(ws: WebSocket, room_id: str, role: str):
    await ws.accept()

    if room_id not in rooms:
        rooms[room_id] = {"sender": None, "receivers": []}

    if role == "sender":
        rooms[room_id]["sender"] = ws
    else:
        rooms[room_id]["receivers"].append(ws)

    try:
        while True:
            data = await ws.receive_json()

            if role == "sender":
                for r in rooms[room_id]["receivers"]:
                    await r.send_json(data)

    except WebSocketDisconnect:
        if role == "sender":
            rooms[room_id]["sender"] = None
        else:
            rooms[room_id]["receivers"].remove(ws)
