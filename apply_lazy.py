import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the blocking fetches from map.on('load')
start_idx = text.find("          // 11. Centrales El")
end_idx = text.find("          map.addSource('power-plants'", start_idx)
if start_idx != -1 and end_idx != -1:
    text = text[:start_idx] + text[end_idx:]

start_idx = text.find("          // 12. Pozos Hidro")
end_idx = text.find("          map.addSource('oil-wells-src'", start_idx)
if start_idx != -1 and end_idx != -1:
    text = text[:start_idx] + text[end_idx:]

start_idx = text.find("          // 13. Proyectos Min")
end_idx = text.find("          map.addSource('mining-projects-src'", start_idx)
if start_idx != -1 and end_idx != -1:
    text = text[:start_idx] + text[end_idx:]

# 2. Empty geojsons on load
text = text.replace("map.addSource('cuencas-oil-src', {\n          type: 'geojson',\n          data: 'datasets/cuencas_hidrocarburos_argentina.geojson'", "map.addSource('cuencas-oil-src', {\n          type: 'geojson',\n          data: { type: 'FeatureCollection', features: [] }")
text = text.replace("map.addSource('gem-pipelines', { type: 'geojson', data: 'datasets/gem_pipelines_lite.geojson' });", "map.addSource('gem-pipelines', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });")
text = text.replace("map.addSource('osm-grid', { type: 'geojson', data: 'datasets/osm_power_grid_lite.geojson' });", "map.addSource('osm-grid', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });")

# 3. Inject loading state flags
text = text.replace('let isPlantsLayerVisible = false;', 'let isPlantsMasterVisible = false;')
text = text.replace('let isOilMasterVisible = false;', 'let isOilMasterVisible = false;\n    let isCuencasLoaded = false;\n    let isGemLoaded = false;\n    let isGridLoaded = false;')

# 4. Modify apply filters
plants_old = r'    function applyPowerPlantFilters\(\) \{'
plants_new = '''    async function applyPowerPlantFilters() {
      if (!isPlantsMasterVisible) return;
      if (rawPowerPlants.length === 0) {
          try {
              const res = await fetch('datasets/power_plants_lite.geojson');
              const data = await res.json();
              rawPowerPlants = data.features || [];
              rawPowerPlants.forEach(f => { if (!f.properties.fuel) f.properties.fuel = 'Other'; });
          } catch(e) { console.error("Error loading plants", e); return; }
      }'''
text = re.sub(plants_old, plants_new, text)

oil_old = r'    function applyOilFilters\(\) \{'
oil_new = '''    async function applyOilFilters() {
      if (!isOilMasterVisible) return;
      if (rawOilWells.length === 0) {
          try {
              const res = await fetch('datasets/oil_wells_argentina_lite.geojson');
              const data = await res.json();
              rawOilWells = data.features || [];
          } catch(e) { console.error("Error loading oil wells", e); return; }
      }'''
text = re.sub(oil_old, oil_new, text)

mining_old = r'    function applyMiningFilters\(\) \{'
mining_new = '''    async function applyMiningFilters() {
      if (!isMiningMasterVisible) return;
      if (rawMiningProjects.length === 0) {
          try {
              const res = await fetch('datasets/mining_lithium_projects_argentina.geojson');
              const data = await res.json();
              rawMiningProjects = data.features || [];
          } catch(e) { console.error("Error loading mining", e); return; }
      }'''
text = re.sub(mining_old, mining_new, text)

# 5. Modify Toggles
plants_toggle = '''async function toggleMasterPlants(enabled) { saveSessionConfig();
      isPlantsMasterVisible = enabled;
      if (enabled) await applyPowerPlantFilters();
      if (map.getLayer('plants-layer')) map.setLayoutProperty('plants-layer', 'visibility', enabled ? 'visible' : 'none');
      const dd = document.getElementById('dropdown-plants');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }'''
text = re.sub(r'function toggleMasterPlants\(enabled\) \{.*?\n.*?else dd\.classList\.add\(\'disabled\'\);\s*\}', plants_toggle, text, flags=re.DOTALL)

mining_toggle = '''async function toggleMasterMining(enabled) { saveSessionConfig();
      isMiningMasterVisible = enabled;
      if (enabled) await applyMiningFilters();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('mining-projects-layer')) map.setLayoutProperty('mining-projects-layer', 'visibility', v);
      const dd = document.getElementById('dropdown-mining');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }'''
text = re.sub(r'function toggleMasterMining\(enabled\) \{.*?\n.*?else dd\.classList\.add\(\'disabled\'\);\s*\}', mining_toggle, text, flags=re.DOTALL)

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
      
      if (enabled) await applyOilFilters();
      
      if (map.getLayer('oil-wells-layer')) map.setLayoutProperty('oil-wells-layer', 'visibility', v);
      if (map.getLayer('cuencas-oil-fill')) map.setLayoutProperty('cuencas-oil-fill', 'visibility', v);
      if (map.getLayer('cuencas-oil-line')) map.setLayoutProperty('cuencas-oil-line', 'visibility', v);

      const dd = document.getElementById('dropdown-oil');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }'''
text = re.sub(r'function toggleMasterOil\(enabled\) \{.*?\n.*?else dd\.classList\.add\(\'disabled\'\);\s*\}', oil_toggle, text, flags=re.DOTALL)

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

# Ensure data array variables exist correctly
text = text.replace('let rawPowerPlants = [];', 'let rawPowerPlants = [];\n    let rawOilWells = [];\n    let rawMiningProjects = [];')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("All lazy loading applied!")
