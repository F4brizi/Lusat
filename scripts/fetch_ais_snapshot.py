import asyncio
import websockets
import json
import os
import time

API_KEY = os.environ.get("AIS_API_KEY")
if not API_KEY:
    print("Error: AIS_API_KEY environment variable not set.")
    exit(1)

OUTPUT_FILE = "datasets/ais_snapshot.geojson"
LISTEN_DURATION = 60 # seconds

active_ships = {}

async def collect_ais_data():
    uri = "wss://stream.aisstream.io/v0/stream"
    
    subscription_message = {
        "APIKey": API_KEY,
        "BoundingBoxes": [[[-60.0, -85.0], [15.0, -30.0]]],
        "FilterMessageTypes": ["PositionReport", "StandardClassBPositionReport", "ExtendedClassBPositionReport", "ShipStaticData"]
    }
    
    print(f"Connecting to AisStream for {LISTEN_DURATION} seconds...")
    try:
        async with websockets.connect(uri) as websocket:
            await websocket.send(json.dumps(subscription_message))
            
            end_time = time.time() + LISTEN_DURATION
            while time.time() < end_time:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    data = json.loads(message)
                    
                    msg_type = data.get("MessageType")
                    meta = data.get("MetaData", {})
                    mmsi = meta.get("MMSI")
                    
                    if not mmsi:
                        continue
                        
                    if mmsi not in active_ships:
                        active_ships[mmsi] = {
                            "mmsi": mmsi,
                            "name": meta.get("ShipName", "").strip(),
                            "timestamp": time.time() * 1000
                        }
                    
                    ship = active_ships[mmsi]
                    
                    if msg_type == "ShipStaticData":
                        static = data.get("Message", {}).get("ShipStaticData", {})
                        if static.get("Destination"):
                            ship["destination"] = static["Destination"].strip()
                    
                    elif msg_type in ["PositionReport", "StandardClassBPositionReport", "ExtendedClassBPositionReport"]:
                        ship["shipClass"] = "A" if msg_type == "PositionReport" else "B"
                        pos = data.get("Message", {}).get(msg_type, {})
                        
                        lat = pos.get("Latitude")
                        lng = pos.get("Longitude")
                        
                        if lat and lng:
                            ship["lat"] = lat
                            ship["lng"] = lng
                            ship["cog"] = pos.get("Cog", 0)
                            ship["sog"] = pos.get("Sog", 0)
                            ship["timestamp"] = time.time() * 1000

                except asyncio.TimeoutError:
                    continue
                except Exception as e:
                    pass
                    
    except Exception as e:
        print(f"Connection error: {e}")

def save_geojson():
    features = []
    for mmsi, ship in active_ships.items():
        if "lat" in ship and "lng" in ship:
            features.append({
                "type": "Feature",
                "properties": {
                    "mmsi": ship["mmsi"],
                    "name": ship.get("name", "Desconocido"),
                    "cog": ship.get("cog", 0),
                    "sog": ship.get("sog", 0),
                    "shipClass": ship.get("shipClass", "A"),
                    "destination": ship.get("destination", "No Reportado"),
                    "timestamp": ship["timestamp"]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [ship["lng"], ship["lat"]]
                }
            })
            
    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(feature_collection, f)
        
    print(f"Saved {len(features)} ships to {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(collect_ais_data())
    save_geojson()
