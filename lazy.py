import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Empty geojsons on load
text = text.replace("map.addSource('cuencas-oil-src', {\n          type: 'geojson',\n          data: 'datasets/cuencas_hidrocarburos_argentina.geojson'", "map.addSource('cuencas-oil-src', {\n          type: 'geojson',\n          data: { type: 'FeatureCollection', features: [] }")
text = text.replace("map.addSource('gem-pipelines', { type: 'geojson', data: 'datasets/gem_pipelines_lite.geojson' });", "map.addSource('gem-pipelines', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });")
text = text.replace("map.addSource('osm-grid', { type: 'geojson', data: 'datasets/osm_power_grid_lite.geojson' });", "map.addSource('osm-grid', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });")

# 2. Inject loading state flags
text = text.replace('let isOilMasterVisible = false;', 'let isOilMasterVisible = false;\n    let isCuencasLoaded = false;\n    let isGemLoaded = false;\n    let isGridLoaded = false;')

# 3. Update toggles to fetch data asynchronously
oil_toggle = '''async function toggleMasterOil(enabled) { saveSessionConfig();
      isOilMasterVisible = enabled;
      const v = enabled ? 'visible' : 'none';
      
      if (enabled && !isCuencasLoaded) {
          try {
              const res = await fetch('datasets/cuencas_hidrocarburos_argentina.geojson');
              const data = await res.json();
              map.getSource('cuencas-oil-src').setData(data);
              isCuencasLoaded = true;
          } catch(e) { console.error("Error loading cuencas", e); }
      }
      
      if (map.getLayer('oil-wells-layer')) map.setLayoutProperty('oil-wells-layer', 'visibility', v);
      if (map.getLayer('cuencas-oil-fill')) map.setLayoutProperty('cuencas-oil-fill', 'visibility', v);
      if (map.getLayer('cuencas-oil-line')) map.setLayoutProperty('cuencas-oil-line', 'visibility', v);

      const dd = document.getElementById('dropdown-oil');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }'''
text = re.sub(r'function toggleMasterOil\(enabled\)\s*\{\s*saveSessionConfig\(\);\s*isOilMasterVisible = enabled;\s*const v = enabled \? \'visible\' : \'none\';\s*if \(map\.getLayer\(\'oil-wells-layer\'\)\) map\.setLayoutProperty\(\'oil-wells-layer\', \'visibility\', v\);\s*if \(map\.getLayer\(\'cuencas-oil-fill\'\)\) map\.setLayoutProperty\(\'cuencas-oil-fill\', \'visibility\', v\);\s*if \(map\.getLayer\(\'cuencas-oil-line\'\)\) map\.setLayoutProperty\(\'cuencas-oil-line\', \'visibility\', v\);\s*const dd = document\.getElementById\(\'dropdown-oil\'\);\s*if \(enabled\) dd\.classList\.remove\(\'disabled\'\);\s*else dd\.classList\.add\(\'disabled\'\);\s*\}', oil_toggle, text, flags=re.DOTALL)

grid_toggle = '''async function toggleMasterGrid(enabled) { saveSessionConfig();
      isGridMasterVisible = enabled;
      
      if (enabled && !isGridLoaded) {
          try {
              const res = await fetch('datasets/osm_power_grid_lite.geojson');
              const data = await res.json();
              map.getSource('osm-grid').setData(data);
              isGridLoaded = true;
          } catch(e) { console.error("Error loading grid", e); }
      }

      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('osm-lines')) map.setLayoutProperty('osm-lines', 'visibility', v);
      
      const dd = document.getElementById('dropdown-grid');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }'''
text = re.sub(r'function toggleMasterGrid\(enabled\)\s*\{\s*saveSessionConfig\(\);\s*isGridMasterVisible = enabled;\s*const v = enabled \? \'visible\' : \'none\';\s*if \(map\.getLayer\(\'osm-lines\'\)\) map\.setLayoutProperty\(\'osm-lines\', \'visibility\', v\);\s*const dd = document\.getElementById\(\'dropdown-grid\'\);\s*if \(enabled\) dd\.classList\.remove\(\'disabled\'\);\s*else dd\.classList\.add\(\'disabled\'\);\s*\}', grid_toggle, text, flags=re.DOTALL)

gem_toggle = '''async function toggleMasterGem(enabled) { saveSessionConfig();
      isGemMasterVisible = enabled;
      
      if (enabled && !isGemLoaded) {
          try {
              const res = await fetch('datasets/gem_pipelines_lite.geojson');
              const data = await res.json();
              map.getSource('gem-pipelines').setData(data);
              isGemLoaded = true;
          } catch(e) { console.error("Error loading gem", e); }
      }

      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('gem-lines')) map.setLayoutProperty('gem-lines', 'visibility', v);
      
      const dd = document.getElementById('dropdown-gem');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }'''
text = re.sub(r'function toggleMasterGem\(enabled\)\s*\{\s*saveSessionConfig\(\);\s*isGemMasterVisible = enabled;\s*const v = enabled \? \'visible\' : \'none\';\s*if \(map\.getLayer\(\'gem-lines\'\)\) map\.setLayoutProperty\(\'gem-lines\', \'visibility\', v\);\s*const dd = document\.getElementById\(\'dropdown-gem\'\);\s*if \(enabled\) dd\.classList\.remove\(\'disabled\'\);\s*else dd\.classList\.add\(\'disabled\'\);\s*\}', gem_toggle, text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
