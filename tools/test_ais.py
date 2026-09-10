import asyncio
import websockets
import json

async def test_ais():
    print("Conectando a AisStream...")
    async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
        print("Conectado.")
        
        # Test with EXACT BoundingBox format used in LUSAT
        sub = {
            "APIKey": "fake_key_12345",
            "BoundingBoxes": [[[-60.0, -85.0], [15.0, -30.0]]]
        }
        await websocket.send(json.dumps(sub))
        print("Suscripcion enviada.")
        
        try:
            # Esperar mensajes
            msg = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            print("Mensaje recibido:", msg)
        except asyncio.TimeoutError:
            print("No se recibieron mensajes en 5 segundos.")
        except websockets.exceptions.ConnectionClosed as e:
            print(f"Conexion cerrada: {e}")

asyncio.run(test_ais())
