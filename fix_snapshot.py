with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

snapshot_code = '''
    async function loadAisSnapshot() {
      try {
        const res = await fetch('datasets/ais_snapshot.geojson?' + Date.now());
        if (!res.ok) return;
        const data = await res.json();
        
        data.features.forEach(f => {
          const p = f.properties;
          const coords = f.geometry.coordinates;
          if (p.mmsi && coords) {
            activeShips.set(p.mmsi, {
              mmsi: p.mmsi,
              name: p.name || 'Desconocido',
              lat: coords[1],
              lng: coords[0],
              cog: p.cog || 0,
              sog: p.sog || 0,
              shipClass: p.shipClass || 'A',
              destination: p.destination || 'No Reportado',
              timestamp: p.timestamp || Date.now(),
              shipTypeString: 'Desconocido',
              eta: 'N/A',
              length: 0,
              beam: 0
            });
          }
        });
        updateAisMapSource();
      } catch(e) {}
    }

    async function connectAisStream() {
      if (activeShips.size === 0) {
        await loadAisSnapshot();
      }
'''

text = text.replace('    function connectAisStream() {', snapshot_code)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
