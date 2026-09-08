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
STATIC_DB_FILE = "datasets/ais_static_db.json"
LISTEN_DURATION = 60 # seconds

active_ships = {}
static_db = {}

def load_static_db():
    global static_db
    if os.path.exists(STATIC_DB_FILE):
        try:
            with open(STATIC_DB_FILE, "r", encoding="utf-8") as f:
                static_db = json.load(f)
            print(f"Loaded {len(static_db)} ships from static DB.")
        except Exception as e:
            print(f"Error loading static DB: {e}")
            static_db = {}

def save_static_db():
    os.makedirs(os.path.dirname(STATIC_DB_FILE), exist_ok=True)
    with open(STATIC_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(static_db, f)
    print(f"Saved {len(static_db)} ships to static DB.")

async def collect_ais_data():
    uri = "wss://stream.aisstream.io/v0/stream"
    
    subscription_message = {
        "APIKey": API_KEY,
        "BoundingBoxes": [[[-60.0, -80.0], [-20.0, -35.0]]],
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
                        
                    # Sync meta name to static db
                    name = meta.get("ShipName", "").strip()
                    if name and mmsi not in static_db:
                        static_db[mmsi] = {"n": name}
                    elif name and mmsi in static_db and "n" not in static_db[mmsi]:
                        static_db[mmsi]["n"] = name

                    if mmsi not in active_ships:
                        active_ships[mmsi] = {
                            "mmsi": mmsi,
                            "timestamp": time.time() * 1000
                        }
                    
                    ship = active_ships[mmsi]
                    
                    if msg_type == "ShipStaticData":
                        static = data.get("Message", {}).get("ShipStaticData", {})
                        if mmsi not in static_db:
                            static_db[mmsi] = {}
                            
                        dest = static.get("Destination")
                        if dest:
                            static_db[mmsi]["d"] = dest.strip()
                            
                        stype = static.get("Type")
                        if stype is not None:
                            static_db[mmsi]["t"] = stype
                            
                        dim = static.get("Dimension")
                        if dim:
                            static_db[mmsi]["l"] = dim.get("A", 0) + dim.get("B", 0)
                            static_db[mmsi]["b"] = dim.get("C", 0) + dim.get("D", 0)
                    
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
            db_info = static_db.get(str(mmsi), {})
            
            features.append({
                "type": "Feature",
                "properties": {
                    "mmsi": ship["mmsi"],
                    "name": db_info.get("n", "Desconocido"),
                    "cog": ship.get("cog", 0),
                    "sog": ship.get("sog", 0),
                    "shipClass": ship.get("shipClass", "A"),
                    "destination": db_info.get("d", "No Reportado"),
                    "type": db_info.get("t", 0),
                    "length": db_info.get("l", 0),
                    "beam": db_info.get("b", 0),
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
    load_static_db()
    asyncio.run(collect_ais_data())
    save_geojson()
    save_static_db()
