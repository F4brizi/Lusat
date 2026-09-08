import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Grid
grid_new = """    async function toggleMasterGrid(enabled) { saveSessionConfig();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('osm-lines')) map.setLayoutProperty('osm-lines', 'visibility', v);
      const dd = document.getElementById('dropdown-grid');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }"""
text = re.sub(r'    async function toggleMasterGrid\(\w+\) \{.*?else dd\.classList\.add\(\'disabled\'\);\s*\}', grid_new, text, flags=re.DOTALL)

# Fix Gem
gem_new = """    async function toggleMasterGem(enabled) { saveSessionConfig();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('gem-lines')) map.setLayoutProperty('gem-lines', 'visibility', v);
      const dd = document.getElementById('dropdown-gem');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }"""
text = re.sub(r'    async function toggleMasterGem\(\w+\) \{.*?else dd\.classList\.add\(\'disabled\'\);\s*\}', gem_new, text, flags=re.DOTALL)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Grid and Gem updated!")
