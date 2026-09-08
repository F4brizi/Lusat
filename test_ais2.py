import asyncio
import websockets
import json

async def test_ais():
    print("Conectando a AisStream con test key (esperando error de auth o conexion)...")
    try:
        async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
            print("Conectado.")
            # Prueba con el formato [NW, SE]
            sub = {
                "APIKey": "invalid",
                "BoundingBoxes": [[[15.0, -85.0], [-60.0, -30.0]]]
            }
            await websocket.send(json.dumps(sub))
            print("Suscripcion enviada.")
            
            msg = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            print("Mensaje recibido:", msg)
    except Exception as e:
        print(f"Error esperado: {e}")

asyncio.run(test_ais())
