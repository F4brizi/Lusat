import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace applySpatialFiltersAll body
new_spatial = """      function applySpatialFiltersAll() {
        // PMTiles handles BBOX natively. We only need to update the MapLibre filters (for the checkboxes)
        // and calculate the UI metrics using map.queryRenderedFeatures.

        // 1. Centrales Eléctricas Filters
        const activeFuelsArray = Array.from(activeFuels);
        if (map.getLayer('plants-layer')) {
            map.setFilter('plants-layer', ['in', ['get', 'fuel'], ['literal', activeFuelsArray]]);
        }
        
        // 2. Oil Wells Filters
        const fShale = document.getElementById('chk-oil-shale')?.checked ?? true;
        const fConv = document.getElementById('chk-oil-conv')?.checked ?? true;
        let oilFilter = ['any'];
        if (fShale) oilFilter.push(['==', ['get', 'tipo'], 'No Convencional']);
        if (fConv) oilFilter.push(['!=', ['get', 'tipo'], 'No Convencional']); // Fallback for conventional
        if (map.getLayer('oil-wells-layer')) {
            if (!fShale && !fConv) {
                map.setFilter('oil-wells-layer', ['==', 'tipo', 'NONE']); // Hide all
            } else if (fShale && fConv) {
                map.setFilter('oil-wells-layer', null); // Show all
            } else {
                map.setFilter('oil-wells-layer', oilFilter);
            }
        }
        
        // 3. Mining Projects (Still GeoJSON)
        if (rawMiningProjects && rawMiningProjects.length > 0) {
            let bounds = null;
            if (isBboxActive) bounds = map.getBounds();
            const west = bounds ? bounds.getWest() : -180;
            const south = bounds ? bounds.getSouth() : -90;
            const east = bounds ? bounds.getEast() : 180;
            const north = bounds ? bounds.getNorth() : 90;

            const fLit = document.getElementById('chk-min-lithium').checked;
            const fCop = document.getElementById('chk-min-copper').checked;
            const fPrec = document.getElementById('chk-min-precious').checked;
            const fOth = document.getElementById('chk-min-other').checked;
            const allowed = [];
            if (fLit) allowed.push('Litio');
            if (fCop) allowed.push('Cobre');
            if (fPrec) { allowed.push('Oro'); allowed.push('Plata'); }
            if (fOth) { allowed.push('Plomo'); allowed.push('Uranio'); allowed.push('Hierro'); }

            const filteredMining = [];
            for (let i = 0; i < rawMiningProjects.length; i++) {
                const feat = rawMiningProjects[i];
                if (!allowed.includes(feat.properties.mineral_principal)) continue;
                if (isBboxActive) {
                    const [lon, lat] = feat.geometry.coordinates;
                    if (lon < west || lon > east || lat < south || lat > north) continue;
                }
                filteredMining.push(feat);
            }
            const srcMining = map.getSource('mining-projects-src');
            if (srcMining) srcMining.setData({ type: 'FeatureCollection', features: filteredMining });
        }
      }

      // We add an event listener to update metrics on render
      map.on('render', () => {
          if (map.getLayer('plants-layer') && map.getLayoutProperty('plants-layer', 'visibility') === 'visible') {
              const features = map.queryRenderedFeatures({ layers: ['plants-layer'] });
              let totalMw = 0;
              // Deduplicate features by id or geometry since tiles overlap
              const unique = new Set();
              features.forEach(f => {
                  const id = f.properties.name || f.geometry.coordinates.join(',');
                  if (!unique.has(id)) {
                      unique.add(id);
                      totalMw += (f.properties.capacity_mw || 0);
                  }
              });
              const countEl = document.getElementById('count-visible');
              if (countEl) countEl.innerText = unique.size.toLocaleString();
              const mwEl = document.getElementById('mw-visible');
              if (mwEl) mwEl.innerText = Math.round(totalMw).toLocaleString() + ' MW';
          }
          
          if (map.getLayer('oil-wells-layer') && map.getLayoutProperty('oil-wells-layer', 'visibility') === 'visible') {
              const features = map.queryRenderedFeatures({ layers: ['oil-wells-layer'] });
              const unique = new Set();
              features.forEach(f => {
                  const id = f.properties.id || f.properties.sigla || f.geometry.coordinates.join(',');
                  unique.add(id);
              });
              const counterEl = document.getElementById('wells-count-visible');
              if (counterEl) counterEl.innerText = unique.size.toLocaleString();
          }
      });
"""
text = re.sub(r'      function applySpatialFiltersAll\(\) \{.*?(?=      function toggleBboxMode\(active\))', new_spatial, text, flags=re.DOTALL)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated spatial filters!")
