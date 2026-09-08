import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

gem_old = '''    function toggleMasterGem(enabled) { saveSessionConfig();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('gem-lines')) map.setLayoutProperty('gem-lines', 'visibility', v);
      const dd = document.getElementById('dropdown-gem');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }'''

gem_new = '''    async function toggleMasterGem(enabled) { saveSessionConfig();
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
text = text.replace(gem_old, gem_new)

grid_old = '''    function toggleMasterGrid(enabled) { saveSessionConfig();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('osm-lines')) map.setLayoutProperty('osm-lines', 'visibility', v);
      const dd = document.getElementById('dropdown-grid');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }'''
    
grid_new = '''    async function toggleMasterGrid(enabled) { saveSessionConfig();
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
text = text.replace(grid_old, grid_new)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
