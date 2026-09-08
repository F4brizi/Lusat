import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix isPlantsLayerVisible -> isPlantsMasterVisible
text = text.replace('let isPlantsLayerVisible = false;', 'let isPlantsMasterVisible = false;')
text = text.replace('isPlantsLayerVisible = enabled;', 'isPlantsMasterVisible = enabled;')
text = text.replace('if (!isPlantsLayerVisible) return;', 'if (!isPlantsMasterVisible) return;')

# Add apply filters to toggles
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
text = re.sub(r'async function toggleMasterOil\(enabled\) \{.*?\n.*?else dd\.classList\.add\(\'disabled\'\);\s*\}', oil_toggle, text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
