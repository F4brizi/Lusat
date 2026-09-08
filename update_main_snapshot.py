import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''if (p.mmsi && coords) {
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
          }'''
          
replacement = '''if (p.mmsi && coords) {
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
              shipTypeString: p.type ? getShipTypeName(p.type) : 'Desconocido',
              eta: 'N/A',
              length: p.length || 0,
              beam: p.beam || 0
            });
          }'''

content = content.replace(target, replacement)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("AIS Snapshot parser updated successfully!")
