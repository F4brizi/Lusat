import asyncio
import websockets
import json
import time
import os

API_KEY = os.environ.get('AIS_API_KEY')
if not API_KEY:
    print("NO API KEY")
    exit(1)

async def check_rio():
    uri = "wss://stream.aisstream.io/v0/stream"
    # Rio de la plata specific bbox
    msg = {
        "APIKey": API_KEY,
        "BoundingBoxes": [[[-35.5, -58.8], [-34.2, -57.5]]]
    }
    
    print("Checking Rio de la Plata...")
    count = 0
    try:
        async with websockets.connect(uri) as ws:
            await ws.send(json.dumps(msg))
            end_time = time.time() + 10
            while time.time() < end_time:
                try:
                    data = await asyncio.wait_for(ws.recv(), timeout=2.0)
                    print(data)
                    count += 1
                except asyncio.TimeoutError:
                    continue
    except Exception as e:
        print("Error:", e)
    
    print(f"Received {count} messages in 10s")

asyncio.run(check_rio())
