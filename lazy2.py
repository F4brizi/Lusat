import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix gem
gem_pattern = r'function toggleMasterGem\(enabled\) \{ saveSessionConfig\(\);\s*isGemMasterVisible = enabled;\s*const v = enabled \? \'visible\' : \'none\';\s*if \(map\.getLayer\(\'gem-lines\'\)\) map\.setLayoutProperty\(\'gem-lines\', \'visibility\', v\);\s*const dd = document\.getElementById\(\'dropdown-gem\'\);\s*if \(enabled\) dd\.classList\.remove\(\'disabled\'\);\s*else dd\.classList\.add\(\'disabled\'\);\s*\}'
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
text = re.sub(gem_pattern, gem_toggle, text, flags=re.DOTALL)

# Fix grid
grid_pattern = r'function toggleMasterGrid\(enabled\) \{ saveSessionConfig\(\);\s*isGridMasterVisible = enabled;\s*const v = enabled \? \'visible\' : \'none\';\s*if \(map\.getLayer\(\'osm-lines\'\)\) map\.setLayoutProperty\(\'osm-lines\', \'visibility\', v\);\s*const dd = document\.getElementById\(\'dropdown-grid\'\);\s*if \(enabled\) dd\.classList\.remove\(\'disabled\'\);\s*else dd\.classList\.add\(\'disabled\'\);\s*\}'
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
text = re.sub(grid_pattern, grid_toggle, text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
