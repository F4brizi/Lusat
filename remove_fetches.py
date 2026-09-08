import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Power Plants
old_plants = r"""        // 11. Centrales Eléctricas WRI \(34.936 puntos\)
        loadMsg\.innerText = 'Cargando 34\.936 centrales eléctricas globales\.\.\.';
        const resPlants = await fetch\('datasets/power_plants_lite\.geojson'\);
        const dataPlants = await resPlants\.json\(\);
        rawPowerPlants = dataPlants\.features \|\| \[\];
        rawPowerPlants\.forEach\(f => \{
          let fuel = f\.properties\.fuel \|\| 'Other';
          if \(!\['Nuclear', 'Hydro', 'Solar', 'Wind', 'Gas', 'Coal', 'Oil'\]\.includes\(fuel\)\) f\.properties\.fuel = 'Other';
        \}\);

        map\.addSource\('power-plants', \{ type: 'geojson', data: \{ type: 'FeatureCollection', features: \[\] \} \}\);
        map\.addLayer\(\{
          id: 'plants-layer',
          type: 'circle',
          source: 'power-plants',"""
new_plants = """        // 11. Centrales Eléctricas WRI (PMTiles Vector)
        map.addSource('power-plants', { type: 'vector', url: 'pmtiles://datasets/power_plants_lite.pmtiles' });
        map.addLayer({
          id: 'plants-layer',
          type: 'circle',
          source: 'power-plants',
          'source-layer': 'power_plants_lite',"""
text = re.sub(old_plants, new_plants, text)

# 2. Oil Wells
old_wells = r"""        // 12. Pozos Hidrocarburíferos de Argentina \(84.239 pozos oficiales\)
        loadMsg\.innerText = 'Cargando 84\.239 pozos de petróleo y gas de Argentina\.\.\.';
        const resWells = await fetch\('datasets/oil_wells_argentina_lite\.geojson'\);
        const dataWells = await resWells\.json\(\);
        rawOilWells = dataWells\.features \|\| \[\];

        map\.addSource\('oil-wells-src', \{ type: 'geojson', data: \{ type: 'FeatureCollection', features: \[\] \} \}\);
        map\.addLayer\(\{
          id: 'oil-wells-layer',
          type: 'circle',
          source: 'oil-wells-src',"""
new_wells = """        // 12. Pozos Hidrocarburíferos (PMTiles Vector)
        map.addSource('oil-wells-src', { type: 'vector', url: 'pmtiles://datasets/oil_wells_argentina_lite.pmtiles' });
        map.addLayer({
          id: 'oil-wells-layer',
          type: 'circle',
          source: 'oil-wells-src',
          'source-layer': 'oil_wells_argentina_lite',"""
text = re.sub(old_wells, new_wells, text)

# 3. Mining Projects (we will just remove the fetch, keep it as empty geojson and lazy load it since it's 36KB and we didn't run pmtiles for it)
old_mining = r"""        // 13. Yacimientos Mineros & Salares de Litio \(SIACAM / 101 Proyectos\)
        loadMsg\.innerText = 'Cargando proyectos mineros y salares de litio\.\.\.';
        const resMining = await fetch\('datasets/mining_lithium_projects\.geojson'\);
        const dataMining = await resMining\.json\(\);
        rawMiningProjects = dataMining\.features \|\| \[\];

        map\.addSource\('mining-projects-src', \{ type: 'geojson', data: \{ type: 'FeatureCollection', features: rawMiningProjects \} \}\);"""
new_mining = """        // 13. Yacimientos Mineros & Salares de Litio (Lazy Load GeoJSON)
        map.addSource('mining-projects-src', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });"""
text = re.sub(old_mining, new_mining, text)

# 4. Gem Pipelines (already empty geojson in load, just switch to PMTiles)
old_gem = r"map\.addSource\('gem-pipelines', \{ type: 'geojson', data: \{ type: 'FeatureCollection', features: \[\] \} \}\);"
new_gem = "map.addSource('gem-pipelines', { type: 'vector', url: 'pmtiles://datasets/gem_pipelines_lite.pmtiles' });"
text = re.sub(old_gem, new_gem, text)

old_gem_layer = r"source: 'gem-pipelines',"
new_gem_layer = "source: 'gem-pipelines',\n          'source-layer': 'gem_pipelines_lite',"
# Only replace the one in map.addLayer for gem-lines
def repl_gem_layer(m):
    return "source: 'gem-pipelines',\n          'source-layer': 'gem_pipelines_lite',"
text = re.sub(r"source:\s*'gem-pipelines',", repl_gem_layer, text)

# 5. OSM Grid
old_grid = r"map\.addSource\('osm-grid', \{ type: 'geojson', data: \{ type: 'FeatureCollection', features: \[\] \} \}\);"
new_grid = "map.addSource('osm-grid', { type: 'vector', url: 'pmtiles://datasets/osm_power_grid_lite.pmtiles' });"
text = re.sub(old_grid, new_grid, text)
def repl_grid_layer(m):
    return "source: 'osm-grid',\n          'source-layer': 'osm_power_grid_lite',"
text = re.sub(r"source:\s*'osm-grid',", repl_grid_layer, text)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Regex replace complete!")
