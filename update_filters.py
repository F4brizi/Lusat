import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Power Plant Filters
new_plants = """    async function applyPowerPlantFilters() {
      if (!isPlantsMasterVisible) return;
      applySpatialFiltersAll();
    }"""
text = re.sub(r'    async function applyPowerPlantFilters\(\) \{.*?applySpatialFiltersAll\(\);\s*\}', new_plants, text, flags=re.DOTALL)

# Oil Filters
new_oil = """    async function applyOilFilters() {
      if (!isOilMasterVisible) return;
      applySpatialFiltersAll();
    }"""
text = re.sub(r'    async function applyOilFilters\(\) \{.*?applySpatialFiltersAll\(\);\s*\}', new_oil, text, flags=re.DOTALL)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Filters updated!")
