import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject aisStaticCache and loadAisStaticDb
injection = '''
    let aisStaticCache = {};

    async function loadAisStaticDb() {
      try {
        const localStr = localStorage.getItem('lusat_ais_static_db');
        if (localStr) {
          aisStaticCache = JSON.parse(localStr);
        }
        const res = await fetch('datasets/ais_static_db.json?' + Date.now());
        if (res.ok) {
          const globalDb = await res.json();
          aisStaticCache = { ...aisStaticCache, ...globalDb };
          localStorage.setItem('lusat_ais_static_db', JSON.stringify(aisStaticCache));
        }
      } catch (e) {
        console.warn('No se pudo cargar la base estatica AIS', e);
      }
    }

    async function loadAisSnapshot() {'''

content = content.replace("async function loadAisSnapshot() {", injection)

# 2. Add loadAisStaticDb call in connectAisStream
connect_target = '''async function connectAisStream() {
      if (activeShips.size === 0) {
        await loadAisSnapshot();
      }'''
connect_replacement = '''async function connectAisStream() {
      if (Object.keys(aisStaticCache).length === 0) {
        await loadAisStaticDb();
      }
      if (activeShips.size === 0) {
        await loadAisSnapshot();
      }'''

content = content.replace(connect_target, connect_replacement)

# 3. Update ShipStaticData handler
static_target = '''if (type === "ShipStaticData") {
          const staticData = aisMessage.Message.ShipStaticData;
          if (activeShips.has(meta.MMSI)) {'''
static_replacement = '''if (type === "ShipStaticData") {
          const staticData = aisMessage.Message.ShipStaticData;
          
          const mmsi = meta.MMSI;
          if (!aisStaticCache[mmsi]) aisStaticCache[mmsi] = {};
          
          if (meta.ShipName) aisStaticCache[mmsi].n = meta.ShipName.trim();
          if (staticData.Destination) aisStaticCache[mmsi].d = staticData.Destination.trim();
          if (staticData.Type) aisStaticCache[mmsi].t = staticData.Type;
          if (staticData.Dimension) {
            aisStaticCache[mmsi].l = staticData.Dimension.A + staticData.Dimension.B;
            aisStaticCache[mmsi].b = staticData.Dimension.C + staticData.Dimension.D;
          }
          localStorage.setItem('lusat_ais_static_db', JSON.stringify(aisStaticCache));

          if (activeShips.has(meta.MMSI)) {'''

content = content.replace(static_target, static_replacement)


# 4. Update PositionReport handler
pos_target = '''if (shipClass && pos) {
          const existing = activeShips.get(meta.MMSI) || {};
          activeShips.set(meta.MMSI, {
            mmsi: meta.MMSI,
            shipClass: shipClass,
            name: meta.ShipName ? meta.ShipName.trim() : existing.name || 'Desconocido',
            lat: pos.Latitude,
            lng: pos.Longitude,
            cog: pos.Cog || 0,
            sog: pos.Sog || 0,
            timestamp: Date.now(),
            shipTypeString: existing.shipTypeString || getShipTypeName(0),
            destination: existing.destination || 'Esperando Datos Estáticos...',
            eta: existing.eta || 'N/A',
            length: existing.length || 0,
            beam: existing.beam || 0
          });'''
pos_replacement = '''if (shipClass && pos) {
          const existing = activeShips.get(meta.MMSI) || {};
          const cached = aisStaticCache[meta.MMSI] || {};
          
          activeShips.set(meta.MMSI, {
            mmsi: meta.MMSI,
            shipClass: shipClass,
            name: meta.ShipName ? meta.ShipName.trim() : existing.name || cached.n || 'Desconocido',
            lat: pos.Latitude,
            lng: pos.Longitude,
            cog: pos.Cog || 0,
            sog: pos.Sog || 0,
            timestamp: Date.now(),
            shipTypeString: existing.shipTypeString || (cached.t ? getShipTypeName(cached.t) : getShipTypeName(0)),
            destination: existing.destination || cached.d || 'Esperando Datos Estáticos...',
            eta: existing.eta || 'N/A',
            length: existing.length || cached.l || 0,
            beam: existing.beam || cached.b || 0
          });'''

content = content.replace(pos_target, pos_replacement)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("AIS updates applied successfully!")
