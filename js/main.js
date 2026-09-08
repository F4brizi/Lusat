// Conversor matemático de Tesela Web Mercator (x, y, z) a Bounding Box EPSG:3857
    function getTileBbox(x, y, z) {
      const n = 20037508.3427892;
      const tileCount = Math.pow(2, z);
      const minx = (x / tileCount) * 2 * n - n;
      const maxx = ((x + 1) / tileCount) * 2 * n - n;
      const miny = n - ((y + 1) / tileCount) * 2 * n;
      const maxy = n - (y / tileCount) * 2 * n;
      return minx.toFixed(4) + ',' + miny.toFixed(4) + ',' + maxx.toFixed(4) + ',' + maxy.toFixed(4);
    }

    // Configuración de Mapas Base y Esquemas Políticos
    const BASEMAPS = {
      dark: {
        base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
      },
      satellite: {
        base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
      },
      light: {
        base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
      },
      carto_light: {
        base: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
      },
      topo: {
        base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
      },
      street: {
        base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
      }
    };

    let activeBase = 'satellite';
    let rawPowerPlants = [];
    let rawOilWells = [];
    let rawMiningProjects = [];
    let isBboxActive = true;
    // INICIO CON TODAS LAS CAPAS APAGADAS (0 SATURACIÓN)
    let isPoliticalMasterVisible = false;
    let isHillshadeMasterVisible = false;
    let isHydroMasterVisible = false;
    let isOilMasterVisible = false;
    let isCuencasLoaded = false;
    let isGemLoaded = false;
    let isGridLoaded = false;
    let isMiningMasterVisible = false;
    let isCadastreMasterVisible = false;
    let isRoadsMasterVisible = false;
    let isPlantsMasterVisible = false;
    let isGridMasterVisible = false;
    let isGemMasterVisible = false;
    let isLandCoverMasterVisible = false;
    let activeFuels = new Set(['Nuclear', 'Hydro', 'Solar', 'Wind', 'Gas', 'Coal', 'Oil', 'Other']);

    // Registro de 16 Fuentes de Datos para Auditoría
    const DATA_SOURCES = [
      {
        id: 'ign-hidro-lineal',
        name: 'Ríos, Arroyos y Canales Oficiales (IGN Lineal)',
        category: 'hydro',
        scope: 'Argentina Completa',
        provider: 'Instituto Geográfico Nacional (IGN)',
        providerUrl: 'https://www.ign.gob.ar/',
        protocol: 'OGC WMS 1.1.1 (GeoServer)',
        lastUpdate: 'Mayo 2024',
        frequency: 'Semestral (Oficial)',
        testUrl: 'https://wms.ign.gob.ar/geoserver/ign/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=lineas_de_aguas_continentales_perenne,lineas_de_aguas_continentales_intermitentes,lineas_de_aguas_continentales_BH020,lineas_de_aguas_continentales_BH030&STYLES=&SRS=EPSG:3857&BBOX=-6734200,-4100000,-6634200,-4000000&WIDTH=64&HEIGHT=64&FORMAT=image/png&TRANSPARENT=true',
        pingType: 'image'
      },
      {
        id: 'ign-hidro-poli',
        name: 'Lagos, Lagunas y Embalses Oficiales (IGN Poligonal)',
        category: 'hydro',
        scope: 'Argentina Completa',
        provider: 'Instituto Geográfico Nacional (IGN)',
        providerUrl: 'https://www.ign.gob.ar/',
        protocol: 'OGC WMS 1.1.1 (GeoServer)',
        lastUpdate: 'Mayo 2024',
        frequency: 'Semestral (Oficial)',
        testUrl: 'https://wms.ign.gob.ar/geoserver/ign/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=areas_de_aguas_continentales_perenne,areas_de_aguas_continentales_intermitente,areas_de_aguas_continentales_BH140,areas_de_aguas_continentales_BH130,areas_de_aguas_continentales_041101&STYLES=&SRS=EPSG:3857&BBOX=-6734200,-4100000,-6634200,-4000000&WIDTH=64&HEIGHT=64&FORMAT=image/png&TRANSPARENT=true',
        pingType: 'image'
      },
      {
        id: 'openseamap-marks',
        name: 'Balizamiento y Vías Navegables Hidrovía',
        category: 'hydro',
        scope: 'Río de la Plata y Cuenca del Plata',
        provider: 'OpenSeaMap / IHO',
        providerUrl: 'https://openseamap.org/',
        protocol: 'Raster Tile TMS (EPSG:3857)',
        lastUpdate: 'Continua',
        frequency: 'Continua',
        testUrl: 'https://tiles.openseamap.org/seamark/8/120/150.png',
        pingType: 'image'
      },
      {
        id: 'ina-sim-crecidas',
        name: 'Simulación Oficial de Crecidas y Alturas (INA SIyAH)',
        category: 'hydro',
        scope: 'Cuenca del Plata',
        provider: 'Instituto Nacional del Agua (INA)',
        providerUrl: 'https://alerta.ina.gob.ar/',
        protocol: 'OGC WMS 1.1.1 (GeoServer)',
        lastUpdate: 'Tiempo Real',
        frequency: 'En vivo / Operativo',
        testUrl: 'https://alerta.ina.gob.ar/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=siyah:alturas_sim_view&STYLES=&SRS=EPSG:3857&BBOX=-6734200,-4100000,-6634200,-4000000&WIDTH=64&HEIGHT=64&FORMAT=image/png&TRANSPARENT=true',
        pingType: 'image'
      },
      {
        id: 'ina-estaciones-live',
        name: 'Estaciones Hidrométricas en Vivo (INA)',
        category: 'hydro',
        scope: 'Cuenca del Plata',
        provider: 'Instituto Nacional del Agua (INA)',
        providerUrl: 'https://alerta.ina.gob.ar/',
        protocol: 'OGC WMS 1.1.1 (GeoServer)',
        lastUpdate: 'Tiempo Real',
        frequency: 'Horaria',
        testUrl: 'https://alerta.ina.gob.ar/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=siyah:estaciones_view&STYLES=&SRS=EPSG:3857&BBOX=-6734200,-4100000,-6634200,-4000000&WIDTH=64&HEIGHT=64&FORMAT=image/png&TRANSPARENT=true',
        pingType: 'image'
      },
      {
        id: 'oil-wells',
        name: 'Pozos Hidrocarburíferos (84.239 pozos)',
        category: 'upstream',
        scope: 'Argentina (Capítulo IV)',
        provider: 'Secretaría de Energía de la Nación',
        providerUrl: 'https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-pozo-capitulo-iv',
        protocol: 'GeoJSON Vectorial Local',
        lastUpdate: 'Agosto 2024',
        frequency: 'Mensual (Ley 17.319)',
        testUrl: 'datasets/oil_wells_argentina_lite.geojson',
        pingType: 'fetch'
      },
      {
        id: 'cuencas-oil',
        name: 'Cuencas Sedimentarias de Hidrocarburos',
        category: 'upstream',
        scope: 'Argentina (24 cuencas)',
        provider: 'Secretaría de Energía / SIG Hidrocarburos',
        providerUrl: 'https://datos.energia.gob.ar/dataset/exploracion-hidrocarburos-cuencas-sedimentarias',
        protocol: 'GeoJSON Vectorial Local',
        lastUpdate: 'Julio 2024',
        frequency: 'Anual',
        testUrl: 'datasets/cuencas_hidrocarburos_argentina.geojson',
        pingType: 'fetch'
      },
      {
        id: 'mining-lithium',
        name: 'Proyectos Mineros y Salares de Litio',
        category: 'upstream',
        scope: 'Argentina & Global (101)',
        provider: 'SIACAM / Minería / Secretaría de Energía',
        providerUrl: 'https://datos.gob.ar/dataset/mineria',
        protocol: 'GeoJSON Vectorial Local',
        lastUpdate: 'Junio 2024',
        frequency: 'Trimestral',
        testUrl: 'datasets/mining_lithium_projects.geojson',
        pingType: 'fetch'
      },
      {
        id: 'opentopo-contours',
        name: 'Curvas de Nivel con Cotas (OpenTopoMap)',
        category: 'terrain',
        scope: 'Global (SRTM / ASTER)',
        provider: 'OpenTopoMap / OSM / SRTM',
        providerUrl: 'https://opentopomap.org/',
        protocol: 'Raster Tile TMS (EPSG:3857)',
        lastUpdate: 'Septiembre 2024',
        frequency: 'Continua',
        testUrl: 'https://a.tile.opentopomap.org/10/374/614.png',
        pingType: 'image'
      },
      {
        id: 'aws-terrarium-dem',
        name: 'Malla de Elevación 3D (Terrarium DEM)',
        category: 'terrain',
        scope: 'Global (30m SRTM)',
        provider: 'AWS Open Data / Mapzen Terrain',
        providerUrl: 'https://registry.opendata.aws/terrain-tiles/',
        protocol: 'Raster-DEM Terrarium (RGB)',
        lastUpdate: 'Agosto 2024',
        frequency: 'Continua',
        testUrl: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/10/374/614.png',
        pingType: 'image'
      },
      {
        id: 'esri-hillshade',
        name: 'Sombreado de Relieve 3D (Hillshade Global)',
        category: 'terrain',
        scope: 'Global (Copernicus DEM)',
        provider: 'Esri Elevation / USGS / NASA',
        providerUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer',
        protocol: 'Raster Tile TMS (EPSG:3857)',
        lastUpdate: 'Septiembre 2024',
        frequency: 'Continua',
        testUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/6/38/20',
        pingType: 'image'
      },
      {
        id: 'ign-mde',
        name: 'Altimetría Nacional MDE-Ar',
        category: 'terrain',
        scope: 'Argentina',
        provider: 'Instituto Geográfico Nacional (IGN)',
        providerUrl: 'https://www.ign.gob.ar/',
        protocol: 'OGC WMS 1.1.1 (GeoServer)',
        lastUpdate: 'Mayo 2024',
        frequency: 'Semestral',
        testUrl: 'https://wms.ign.gob.ar/geoserver/ign/wms?SERVICE=WMS&REQUEST=GetCapabilities',
        pingType: 'fetch'
      },
      {
        id: 'cadastre-formosa',
        name: 'Catastro & Parcelas Rurales Formosa',
        category: 'cadastre',
        scope: 'Prov. Formosa',
        provider: 'IDEF / SIT Formosa',
        providerUrl: 'https://sit.formosa.gob.ar/',
        protocol: 'ArcGIS MapServer Export / WMS',
        lastUpdate: 'Julio 2024',
        frequency: 'Semestral (Oficial)',
        testUrl: 'https://sit.formosa.gob.ar/sit.public/proxy.ashx?https://10.10.0.36/arcgis/rest/services/Formosa/Base_Pub/MapServer/export?bbox=-6734200,-3030000,-6730000,-3025000&bboxSR=3857&size=64,64&f=image&layers=show:6,4,2',
        pingType: 'image'
      },
      {
        id: 'cadastre-cordoba',
        name: 'Catastro Parcelario Córdoba',
        category: 'cadastre',
        scope: 'Prov. Córdoba',
        provider: 'IDECOR (Gobierno de Córdoba)',
        providerUrl: 'https://mapascordoba.gob.ar/',
        protocol: 'OGC WMS 1.1.1 (GeoServer)',
        lastUpdate: 'Enero 2025',
        frequency: 'Mensual (Continua)',
        testUrl: 'https://idecor-ws.mapascordoba.gob.ar/geoserver/wms?SERVICE=WMS&REQUEST=GetCapabilities',
        pingType: 'fetch'
      },
      {
        id: 'cadastre-santafe',
        name: 'Parcelario & Cotas Catastrales SCIT',
        category: 'cadastre',
        scope: 'Prov. Santa Fe',
        provider: 'SCIT / IDESF Santa Fe',
        providerUrl: 'https://aswe.santafe.gov.ar/idesf/',
        protocol: 'OGC WMS 1.1.1 (GeoServer)',
        lastUpdate: 'Diciembre 2024',
        frequency: 'Trimestral (Oficial)',
        testUrl: 'https://aswe.santafe.gov.ar/idesf/wms?SERVICE=WMS&REQUEST=GetCapabilities',
        pingType: 'fetch'
      },
      {
        id: 'plants-wri',
        name: 'Global Power Plant Database',
        category: 'energy',
        scope: 'Global (34.936 ptos)',
        provider: 'World Resources Institute (WRI)',
        providerUrl: 'https://www.wri.org/research/global-power-plant-database',
        protocol: 'GeoJSON Vectorial Local',
        lastUpdate: 'Junio 2024 (v1.3.0)',
        frequency: 'Anual',
        testUrl: 'datasets/power_plants_lite.geojson',
        pingType: 'fetch'
      },
      {
        id: 'pipelines-gem',
        name: 'Ductos Troncales (Gasoductos & Oleoductos)',
        category: 'energy',
        scope: 'Global',
        provider: 'Global Energy Monitor (GEM)',
        providerUrl: 'https://globalenergymonitor.org/',
        protocol: 'GeoJSON Vectorial Local',
        lastUpdate: 'Mayo 2024',
        frequency: 'Trimestral',
        testUrl: 'datasets/gem_pipelines_lite.geojson',
        pingType: 'fetch'
      },
      {
        id: 'power-grid-osm',
        name: 'Red Eléctrica Alta Tensión (HIFLD + Mercosur)',
        category: 'energy',
        scope: 'USA + Sudamérica',
        provider: 'DHS HIFLD & OpenStreetMap',
        providerUrl: 'https://hifld-geoplatform.opendata.arcgis.com/',
        protocol: 'GeoJSON Vectorial Local',
        lastUpdate: 'Septiembre 2024',
        frequency: 'Continua',
        testUrl: 'datasets/osm_power_grid_lite.geojson',
        pingType: 'fetch'
      },
      {
        id: 'highways-dnv',
        name: 'Red Troncal de Rutas (Nacionales & Prov.)',
        category: 'roads',
        scope: 'Argentina',
        provider: 'DNV Vialidad Nacional & OSM',
        providerUrl: 'https://www.argentina.gob.ar/vialidad-nacional',
        protocol: 'GeoJSON Vectorial Local',
        lastUpdate: 'Septiembre 2024',
        frequency: 'Mensual',
        testUrl: 'datasets/road_network_highways.geojson',
        pingType: 'fetch'
      },
      {
        id: 'transport-roads',
        name: 'Malla Vial Urbana & Caminos Rurales',
        category: 'roads',
        scope: 'Global',
        provider: 'Esri World Transportation / HERE',
        providerUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer',
        protocol: 'Raster Tile TMS (EPSG:3857)',
        lastUpdate: 'Septiembre 2024',
        frequency: 'Mensual',
        testUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/6/38/20',
        pingType: 'image'
      },
      {
        id: 'political-ref',
        name: 'Esquema Político, Provincias y Ciudades',
        category: 'base',
        scope: 'Global',
        provider: 'Esri Canvas Reference / DeLorme',
        providerUrl: 'https://www.arcgis.com/home/item.html?id=30d6bed8d34947908a738ea674218381',
        protocol: 'Raster Tile TMS (EPSG:3857)',
        lastUpdate: 'Agosto 2024',
        frequency: 'Continua',
        testUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/4/9/4',
        pingType: 'image'
      },
      {
        id: 'landcover-sentinel',
        name: 'Cobertura de Suelo y Cultivos 10m',
        category: 'terrain',
        scope: 'Global (10m)',
        provider: 'ESA Sentinel-2 & Impact Observatory',
        providerUrl: 'https://livingatlas.arcgis.com/landcoverexplorer/',
        protocol: 'ArcGIS ImageServer Export',
        lastUpdate: 'Abril 2024',
        frequency: 'Anual (2024 Release)',
        testUrl: 'https://ic.imagery1.arcgis.com/arcgis/rest/services/Sentinel2_10m_LandCover/ImageServer?f=json',
        pingType: 'fetch'
      },
      {
        id: 'overpass-rural',
        name: 'Huellas y Caminos Rurales en Vivo',
        category: 'roads',
        scope: 'BBOX Dinámico',
        provider: 'OpenStreetMap Overpass API',
        providerUrl: 'https://overpass-api.de/',
        protocol: 'REST API (Overpass QL)',
        lastUpdate: 'Tiempo Real',
        frequency: 'En vivo al consultar',
        testUrl: 'https://overpass-api.de/api/status',
        pingType: 'fetch'
      }
    ];

    const sourceHealthState = {};
    DATA_SOURCES.forEach(s => {
      sourceHealthState[s.id] = { status: 'pending', latency: null, httpCode: null, lastTested: null };
    });

    // Inicializar Mapa MapLibre
    let protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    const map = new maplibregl.Map({
      container: 'map',
      transformRequest: (url, resourceType) => {
        if (url.includes('tile=')) {
          const m = url.match(/tile=(\d+)\/(\d+)\/(\d+)/);
          if (m) {
            const z = parseInt(m[1], 10);
            const x = parseInt(m[2], 10);
            const y = parseInt(m[3], 10);
            const bbox = getTileBbox(x, y, z);
            const newUrl = url.replace('{bbox-epsg-3857}', bbox).replace(/&tile=\d+\/\d+\/\d+/, '');
            return { url: newUrl };
          }
        }
        return { url };
      },
      style: {
        version: 8,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {
          'basemap-dark-src': { type: 'raster', tiles: [BASEMAPS.dark.base], tileSize: 256, attribution: 'Esri' },
          'basemap-satellite-src': { type: 'raster', tiles: [BASEMAPS.satellite.base], tileSize: 256, attribution: 'Esri, Maxar' },
          'basemap-light-src': { type: 'raster', tiles: [BASEMAPS.light.base], tileSize: 256, attribution: 'Esri' },
          'basemap-carto_light-src': { type: 'raster', tiles: [BASEMAPS.carto_light.base], tileSize: 256, attribution: 'CartoDB' },
          'basemap-topo-src': { type: 'raster', tiles: [BASEMAPS.topo.base], tileSize: 256, attribution: 'Esri' },
          'basemap-street-src': { type: 'raster', tiles: [BASEMAPS.street.base], tileSize: 256, attribution: 'Esri' },
          'political-ref-src': { type: 'raster', tiles: [BASEMAPS.satellite.reference], tileSize: 256 }
        },
        layers: [
          { id: 'basemap-dark', type: 'raster', source: 'basemap-dark-src', layout: { visibility: 'none' } },
          { id: 'basemap-light', type: 'raster', source: 'basemap-light-src', layout: { visibility: 'none' } },
          { id: 'basemap-carto_light', type: 'raster', source: 'basemap-carto_light-src', layout: { visibility: 'none' } },
          { id: 'basemap-topo', type: 'raster', source: 'basemap-topo-src', layout: { visibility: 'none' } },
          { id: 'basemap-street', type: 'raster', source: 'basemap-street-src', layout: { visibility: 'none' } },
          { id: 'basemap-satellite', type: 'raster', source: 'basemap-satellite-src', layout: { visibility: 'visible' } }
        ]
      },
      center: [-68.5, -38.5], // Vista inicial centrada en Cuenca Neuquina / Vaca Muerta
      zoom: 5.8,
      pitch: 0,
      bearing: 0,
      antialias: true
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.FullscreenControl({ container: document.documentElement }), 'top-right');

    // FPS Telemetry
    let frames = 0, lastFpsCheck = performance.now();
    function tickFps() {
      frames++;
      const now = performance.now();
      if (now - lastFpsCheck >= 1000) {
        document.getElementById('fps-counter').innerText = frames + ' FPS';
        frames = 0;
        lastFpsCheck = now;
      }
      requestAnimationFrame(tickFps);
    }
    requestAnimationFrame(tickFps);

    // Carga de Capas
    map.on('load', async () => {
      const loadMsg = document.getElementById('load-msg');

      try {
        // 1. Malla de Terreno Físico 3D (AWS Terrarium DEM)
        loadMsg.innerText = 'Cargando Malla de Terreno 3D (Terrarium DEM)...';
        map.addSource('terrain-dem', {
          type: 'raster-dem',
          tiles: [
            'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
          ],
          encoding: 'terrarium',
          tileSize: 256,
          maxzoom: 15
        });

        // Activar relieve físico 3D inicial con exageración 1.4x
        map.setTerrain({ source: 'terrain-dem', exaggeration: 0.0001 });

        // 1.b Curvas de Nivel con Cotas Numéricas en Metros (OpenTopoMap)
        loadMsg.innerText = 'Cargando Curvas de Nivel Topográficas (OpenTopoMap)...';
        map.addSource('opentopo-src', {
          type: 'raster',
          tiles: [
            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          maxzoom: 17,
          attribution: '&copy; OpenTopoMap (CC-BY-SA), SRTM'
        });

        map.addLayer({
          id: 'opentopo-layer',
          type: 'raster',
          source: 'opentopo-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.85 }
        });

        // 1.c Sombreado de Iluminación Oblicua (Esri Hillshade)
        map.addSource('hillshade-raster-src', {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: '&copy; Esri, USGS, NASA'
        });

        map.addLayer({
          id: 'hillshade-layer',
          type: 'raster',
          source: 'hillshade-raster-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.50 }
        });

        // 1.d Altimetría MDE IGN Argentina WMS
        map.addSource('ign-mde-src', {
          type: 'raster',
          tiles: [
            'https://wms.ign.gob.ar/geoserver/ign/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=ign:sombreado_mde_ar&STYLES=&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=true&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          attribution: '&copy; Instituto Geográfico Nacional (IGN)'
        });

        map.addLayer({
          id: 'ign-mde-layer',
          type: 'raster',
          source: 'ign-mde-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.75 }
        });

        // 2. Suelo y Cultivos 10m (Sentinel-2 / Esri)
        map.addSource('sentinel2-landcover', {
          type: 'raster',
          tiles: [
            'https://ic.imagery1.arcgis.com/arcgis/rest/services/Sentinel2_10m_LandCover/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=3857&size=256,256&imageSR=3857&format=png32&f=image&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          attribution: '&copy; Impact Observatory, Esri'
        });

        map.addLayer({
          id: 'landcover-layer',
          type: 'raster',
          source: 'sentinel2-landcover',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.65 }
        });


        // =========================================================
        // HIDROGRAFÍA OFICIAL & SIMULACIÓN DE CRECIDAS (IGN / INA / OPENSEAMAP)
        // =========================================================
        loadMsg.innerText = 'Cargando Hidrografía Oficial de la República Argentina (IGN)...';
        
        // 1. Ríos, Arroyos y Canales (IGN Oficial WMS)
        map.addSource('ign-hidro-lineal-src', {
          type: 'raster',
          tiles: [
            'https://wms.ign.gob.ar/geoserver/ign/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=lineas_de_aguas_continentales_perenne,lineas_de_aguas_continentales_intermitentes,lineas_de_aguas_continentales_BH020,lineas_de_aguas_continentales_BH030&STYLES=&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=true&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          attribution: '&copy; Instituto Geográfico Nacional (IGN Argentina)'
        });

        map.addLayer({
          id: 'ign-hidro-lineal-layer',
          type: 'raster',
          source: 'ign-hidro-lineal-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.85 }
        });

        // 2. Lagos, Lagunas y Embalses (IGN Oficial WMS)
        map.addSource('ign-hidro-poli-src', {
          type: 'raster',
          tiles: [
            'https://wms.ign.gob.ar/geoserver/ign/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=areas_de_aguas_continentales_perenne,areas_de_aguas_continentales_intermitente,areas_de_aguas_continentales_BH140,areas_de_aguas_continentales_BH130,areas_de_aguas_continentales_041101&STYLES=&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=true&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          attribution: '&copy; Instituto Geográfico Nacional (IGN Argentina)'
        });

        map.addLayer({
          id: 'ign-hidro-poli-layer',
          type: 'raster',
          source: 'ign-hidro-poli-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.75 }
        });

        // 3. Balizamiento y Canales Náuticos de la Hidrovía (OpenSeaMap)
        map.addSource('openseamap-src', {
          type: 'raster',
          tiles: [
            'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '&copy; OpenSeaMap, IHO'
        });

        map.addLayer({
          id: 'openseamap-layer',
          type: 'raster',
          source: 'openseamap-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.90 }
        });

        // 4. Simulación Oficial de Crecidas y Alturas Hidrométricas (INA SIyAH)
        map.addSource('ina-sim-src', {
          type: 'raster',
          tiles: [
            'https://alerta.ina.gob.ar/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=siyah:alturas_sim_view&STYLES=&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=true&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          attribution: '&copy; Instituto Nacional del Agua (INA) - SIyAH'
        });

        map.addLayer({
          id: 'ina-sim-layer',
          type: 'raster',
          source: 'ina-sim-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.85 }
        });

        // 5. Estaciones Hidrométricas en Tiempo Real (INA)
        map.addSource('ina-estaciones-src', {
          type: 'raster',
          tiles: [
            'https://alerta.ina.gob.ar/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=siyah:estaciones_view&STYLES=&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=true&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          attribution: '&copy; Instituto Nacional del Agua (INA)'
        });

        map.addLayer({
          id: 'ina-estaciones-layer',
          type: 'raster',
          source: 'ina-estaciones-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.90 }
        });

        // 3. Cuencas Hidrocarburíferas Oficiales (Polígonos Sec. Energía)
        loadMsg.innerText = 'Cargando Cuencas Hidrocarburíferas de Argentina...';
        map.addSource('cuencas-oil-src', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        map.addLayer({
          id: 'cuencas-oil-fill',
          type: 'fill',
          source: 'cuencas-oil-src',
          layout: { 'visibility': 'none' },
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'TIPO'], 'Productiva'], '#ea580c',
              '#475569'
            ],
            'fill-opacity': 0.18
          }
        });

        map.addLayer({
          id: 'cuencas-oil-line',
          type: 'line',
          source: 'cuencas-oil-src',
          layout: { 'visibility': 'none' },
          paint: {
            'line-color': [
              'case',
              ['==', ['get', 'TIPO'], 'Productiva'], '#f97316',
              '#64748b'
            ],
            'line-width': 1.6,
            'line-opacity': 0.8
          }
        });

        // 4. Catastro Provincial WMS (Formosa, Córdoba, Santa Fe)
        // 4.1 Catastro Formosa - Geometría y Límites (Base_Pub: Zoom Infinito maxScale=0)
        map.addSource('cadastre-formosa-src', {
          type: 'raster',
          tiles: [
            'https://sit.formosa.gob.ar/sit.public/proxy.ashx?https://10.10.0.36/arcgis/rest/services/Formosa/Base_Pub/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&f=image&layers=show:6,4,2&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          maxzoom: 22,
          attribution: '&copy; IDEF SIT Formosa'
        });
        map.addLayer({
          id: 'cadastre-formosa-layer',
          type: 'raster',
          source: 'cadastre-formosa-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.85 }
        });

        // 4.2 Eliminado: WMS desactivado por problemas de maxScale y duplicidad.

        map.addSource('cadastre-cordoba-src', {
          type: 'raster',
          tiles: [
            'https://idecor-ws.mapascordoba.gob.ar/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=idecor:parcelas&STYLES=&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=true&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          attribution: '&copy; IDECOR Córdoba'
        });
        map.addLayer({ id: 'cadastre-cordoba-layer', type: 'raster', source: 'cadastre-cordoba-src', layout: { 'visibility': 'none' }, paint: { 'raster-opacity': 0.85 } });

        map.addSource('cadastre-santafe-src', {
          type: 'raster',
          tiles: [
            'https://aswe.santafe.gov.ar/idesf/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=scit_parcelas,cotas_catastro&STYLES=&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=true&tile={z}/{x}/{y}'
          ],
          tileSize: 256,
          attribution: '&copy; SCIT / IDESF Santa Fe'
        });
        map.addLayer({ id: 'cadastre-santafe-layer', type: 'raster', source: 'cadastre-santafe-src', layout: { 'visibility': 'none' }, paint: { 'raster-opacity': 0.85 } });

        // 5. Malla Vial Urbana y Caminos Rurales (Esri Transportation)
        map.addSource('transport-roads-overlay', {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: '&copy; Esri, HERE'
        });
        map.addLayer({ id: 'roads-raster-overlay', type: 'raster', source: 'transport-roads-overlay', layout: { 'visibility': 'none' }, paint: { 'raster-opacity': 0.85 } });

        // 6. Esquema Político y Ciudades (Reference Overlay)
        map.addLayer({
          id: 'political-reference-layer',
          type: 'raster',
          source: 'political-ref-src',
          layout: { 'visibility': 'none' },
          paint: { 'raster-opacity': 0.95 }
        });

        // 7. Red Troncal Vectorial de Rutas
        map.addSource('highways-vector', { type: 'geojson', data: 'datasets/road_network_highways.geojson' });
        map.addLayer({
          id: 'roads-vector-line',
          type: 'line',
          source: 'highways-vector',
          layout: { 'visibility': 'none' },
          paint: {
            'line-color': ['match', ['get', 'cat'], 'Ruta Nacional', '#ef4444', 'Ruta Provincial', '#f59e0b', '#94a3b8'],
            'line-width': ['match', ['get', 'cat'], 'Ruta Nacional', 2.4, 'Ruta Provincial', 1.7, 1.2],
            'line-opacity': 0.9
          }
        });

        // 8. Huellas Rurales Dinámicas
        map.addSource('rural-roads-dynamic', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({
          id: 'rural-roads-line',
          type: 'line',
          source: 'rural-roads-dynamic',
          paint: { 'line-color': '#fbbf24', 'line-width': 1.6, 'line-dasharray': [3, 2], 'line-opacity': 0.85 }
        });

        // 9. Ductos Críticos GEM
        map.addSource('gem-pipelines', { type: 'vector', url: 'pmtiles://datasets/gem_pipelines_lite.pmtiles' });
        map.addLayer({
          id: 'gem-lines',
          type: 'line',
          source: 'gem-pipelines',
          'source-layer': 'gem_pipelines_lite',
          layout: { 'visibility': 'none' },
          paint: {
            'line-color': ['case', ['in', 'Gas', ['get', 'product']], '#00e5ff', ['in', 'Oil', ['get', 'product']], '#ff3366', '#a855f7'],
            'line-width': 2,
            'line-opacity': 0.85
          }
        });

        // 10. Red Alta Tensión OSM
        map.addSource('osm-grid', { type: 'vector', url: 'pmtiles://datasets/osm_power_grid_lite.pmtiles' });
        map.addLayer({
          id: 'osm-lines',
          type: 'line',
          source: 'osm-grid',
          'source-layer': 'osm_power_grid_lite',
          layout: { 'visibility': 'none' },
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': ['match', ['get', 'volt'], '500 kV', '#facc15', '220 kV', '#fb923c', '132 kV', '#38bdf8', '110 kV', '#38bdf8', '#64748b'],
            'line-width': 1.8,
            'line-opacity': 0.75
          }
        });

        // 11. Centrales Eléctricas WRI (PMTiles Vector)
        map.addSource('power-plants', { type: 'vector', url: 'pmtiles://datasets/power_plants_lite.pmtiles' });
        map.addLayer({
          id: 'plants-layer',
          type: 'circle',
          source: 'power-plants',
          'source-layer': 'power_plants_lite',
          layout: { 'visibility': 'none' },
          paint: {
            'circle-color': [
              'match', ['get', 'fuel'],
              'Nuclear', '#f43f5e', 'Hydro', '#0284c7', 'Solar', '#eab308', 'Wind', '#10b981',
              'Gas', '#f97316', 'Coal', '#64748b', 'Oil', '#a855f7', '#14b8a6'
            ],
            'circle-radius': ['interpolate', ['linear'], ['get', 'capacity_mw'], 0, 3.5, 100, 5, 1000, 7.5, 4000, 13],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': 0.7
          }
        });

        // 12. Pozos Hidrocarburíferos (PMTiles Vector)
        map.addSource('oil-wells-src', { type: 'vector', url: 'pmtiles://datasets/oil_wells_argentina_lite.pmtiles' });
        map.addLayer({
          id: 'oil-wells-layer',
          type: 'circle',
          source: 'oil-wells-src',
          'source-layer': 'oil_wells_argentina_lite',
          layout: { 'visibility': 'none' },
          paint: {
            'circle-color': [
              'case',
              ['==', ['get', 'tipo'], 'No Convencional'], '#d946ef', // Magenta Neón para Vaca Muerta
              '#f97316' // Naranja Ámbar para Convencional
            ],
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              4, 1.5,
              7, 2.5,
              10, 4.5,
              14, 7.5
            ],
            'circle-stroke-width': 0.8,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': 0.6
          }
        });

        // 13. Yacimientos Mineros & Salares de Litio (Lazy Load GeoJSON)
        map.addSource('mining-projects-src', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({
          id: 'mining-projects-layer',
          type: 'circle',
          source: 'mining-projects-src',
          layout: { 'visibility': 'none' },
          paint: {
            'circle-color': [
              'match', ['get', 'mineral'],
              'Litio', '#06b6d4',
              'Cobre', '#f97316',
              'Oro', '#eab308',
              'Plata', '#94a3b8',
              'Uranio', '#22c55e',
              '#a855f7'
            ],
            'circle-radius': 6.5,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': 0.9
          }
        });

        // Altímetro en vivo bajo cursor (Cota en metros sobre el nivel del mar)
        map.on('mousemove', (e) => {
          let elev = null;
          try {
            elev = map.queryTerrainElevation(e.lngLat);
          } catch (err) {}

          const elevEl = document.getElementById('telemetry-elevation');
          const cardElevEl = document.getElementById('live-elevation-card');
          const cardCoordsEl = document.getElementById('live-coords-card');

          const lat = e.lngLat.lat;
          const lng = e.lngLat.lng;
          const latSign = lat >= 0 ? '+' : '';
          const lngSign = lng >= 0 ? '+' : '';

          if (cardCoordsEl) {
            cardCoordsEl.innerText = `Lat: ${latSign}${lat.toFixed(4)}°, Lon: ${lngSign}${lng.toFixed(4)}°`;
          }

          if (elev !== null && elev !== undefined && !isNaN(elev)) {
            const m = Math.round(elev);
            const sign = m >= 0 ? '+' : '';
            const formatted = `${sign}${m.toLocaleString()} msnm`;
            if (elevEl) elevEl.innerText = formatted;
            if (cardElevEl) cardElevEl.innerText = `${sign}${m.toLocaleString()}`;
          }
        });

        // Detector de inclinación de cámara para el botón 3D superior
        map.on('pitch', () => {
          const btn3d = document.getElementById('btn-top-3d');
          if (btn3d) {
            if (map.getPitch() > 25) btn3d.classList.add('active');
            else btn3d.classList.remove('active');
          }
        });

        // 10. Tráfico Marítimo (AIS en vivo)
        map.addSource('ais-ships-src', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'ais-ships-layer',
          type: 'symbol',
          source: 'ais-ships-src',
          layout: {
            'icon-image': ['case', ['==', ['get', 'shipClass'], 'A'], 'ship-triangle-a', 'ship-triangle-b'],
            'icon-size': 0.5,
            'icon-rotate': ['get', 'cog'],
            'icon-allow-overlap': true,
            'icon-rotation-alignment': 'map'
          },
          paint: {


          }
        });
        
        map.addLayer({
          id: 'ais-ships-labels',
          type: 'symbol',
          source: 'ais-ships-src',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 11,
            'text-offset': [0, 1.2],
            'text-anchor': 'top',
            'text-optional': true
          },
          paint: {
            'text-color': '#93c5fd',
            'text-halo-color': '#0f172a',
            'text-halo-width': 2
          }
        });


        // Popups
        


        
        // Generate Triangle Icons dynamically
        const size = 24;
        function createTriangle(color) {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.moveTo(size/2, 2);
          ctx.lineTo(size-2, size-2);
          ctx.lineTo(2, size-2);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#0f172a';
          ctx.stroke();
          return ctx.getImageData(0, 0, size, size);
        }
        map.addImage('ship-triangle-a', createTriangle('#60a5fa'));
        map.addImage('ship-triangle-b', createTriangle('#34d399'));
        setupPopups();

        // Inicializar tabla de fuentes en el modal
        renderSourcesTable();

        // Aplicar filtros espaciales a todas las capas de puntos
        applySpatialFiltersAll();

        map.on('moveend', () => {
          const autoReload = document.getElementById('toggle-auto-reload').checked;
          if (isBboxActive && autoReload) {
            applySpatialFiltersAll();
          }
        });

        // Inicializar Capas MapLibre de LUSAT Geo-Copilot
        initCopilotMapLayers();

                // Inicializar Cookies y Restaurar Sesión si corresponde (o mantener todo apagado)
        checkCookieConsentOnInit();
        
        map.on('moveend', () => {
          saveSessionConfig();
        });

                // Ocultar pantalla de carga
        const loadScreen = document.getElementById('loading-screen');
        loadScreen.style.opacity = '0';
        setTimeout(() => loadScreen.style.display = 'none', 300);

      } catch (err) {
        console.error(err);
        loadMsg.innerText = 'Error al cargar capas: ' + err.message;
      }
    });


    // =========================================================
    // MOTOR DE COOKIES TÉCNICAS & PERSISTENCIA DE SESIÓN
    // =========================================================
    function setCookie(name, value, days) {
      const d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Lax";
      try { localStorage.setItem(name, value); } catch(e) {}
    }

    function getCookie(name) {
      try {
        const localVal = localStorage.getItem(name);
        if (localVal !== null && localVal !== undefined) return localVal;
      } catch(e) {}
      const cname = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) === 0) return decodeURIComponent(c.substring(cname.length, c.length));
      }
      return null;
    }

    function deleteCookie(name) {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      try { localStorage.removeItem(name); } catch(e) {}
    }

    function checkCookieConsentOnInit() {
      const consent = getCookie('lusat_cookie_consent');
      if (consent === 'accepted') {
        const badge = document.getElementById('session-badge');
        if (badge) badge.innerText = 'SESIÓN: GUARDADA';
        restoreSessionConfig();
      } else if (consent === 'rejected') {
        const badge = document.getElementById('session-badge');
        if (badge) badge.innerText = 'SESIÓN: TEMPORAL';
      } else {
        // Mostrar Banner de Cookies si no ha decidido
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.style.display = 'flex';
      }
    }

    function acceptCookies() {
      setCookie('lusat_cookie_consent', 'accepted', 365);
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.style.display = 'none';
      const badge = document.getElementById('session-badge');
      if (badge) {
        badge.innerText = 'SESIÓN: GUARDADA';
        badge.style.color = '#10b981';
      }
      saveSessionConfig();
    }

    function rejectCookies() {
      setCookie('lusat_cookie_consent', 'rejected', 30);
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.style.display = 'none';
      const badge = document.getElementById('session-badge');
      if (badge) {
        badge.innerText = 'SESIÓN: TEMPORAL';
        badge.style.color = '#94a3b8';
      }
    }

    function openCookiePolicyModal() {
      document.getElementById('cookie-policy-modal-overlay').classList.add('active');
    }

    function closeCookiePolicyModal() {
      document.getElementById('cookie-policy-modal-overlay').classList.remove('active');
    }

    function handleCookieModalOverlayClick(e) {
      if (e.target.id === 'cookie-policy-modal-overlay') closeCookiePolicyModal();
    }

    function clearAllCookiesAndReset() {
      deleteCookie('lusat_cookie_consent');
      deleteCookie('lusat_session_config');
      alert('✓ Cookies técnicas y almacenamiento local eliminados. LUSAT se recargará con todas las capas apagadas.');
      window.location.reload();
    }

    // Guardar Configuración de Sesión en Cookie / LocalStorage
    function saveSessionConfig() {
      if (getCookie('lusat_cookie_consent') !== 'accepted') return;

      const config = {
        layers: {
          political: document.getElementById('chk-political')?.checked ?? false,
          hillshade: document.getElementById('chk-hillshade')?.checked ?? false,
          opentopo: document.getElementById('chk-opentopo')?.checked ?? false,
          terrain3d: document.getElementById('chk-terrain-3d')?.checked ?? false,
          esriHillshade: document.getElementById('chk-esri-hillshade')?.checked ?? false,
          ignMde: document.getElementById('chk-ign-mde')?.checked ?? false,
          hydro: document.getElementById('chk-hydro-master')?.checked ?? false,
          ignHidroLineal: document.getElementById('chk-ign-hidro-lineal')?.checked ?? false,
          ignHidroPoli: document.getElementById('chk-ign-hidro-poli')?.checked ?? false,
          openseamap: document.getElementById('chk-openseamap')?.checked ?? false,
          inaSim: document.getElementById('chk-ina-sim')?.checked ?? false,
          inaEstaciones: document.getElementById('chk-ina-estaciones')?.checked ?? false,
          oil: document.getElementById('chk-oil')?.checked ?? false,
          cuencasPoly: document.getElementById('chk-cuencas-poly')?.checked ?? false,
          oilShale: document.getElementById('chk-oil-shale')?.checked ?? false,
          oilConv: document.getElementById('chk-oil-conv')?.checked ?? false,
          mining: document.getElementById('chk-mining')?.checked ?? false,
          cadastre: document.getElementById('chk-cadastre')?.checked ?? false,
          roads: document.getElementById('chk-roads')?.checked ?? false,
          plants: document.getElementById('chk-plants')?.checked ?? false,
          grid: document.getElementById('chk-grid')?.checked ?? false,
          gem: document.getElementById('chk-gem')?.checked ?? false,
          landcover: document.getElementById('chk-landcover')?.checked ?? false,
          ais: document.getElementById('chk-ais')?.checked ?? false
        },
        opacities: {
          political: document.getElementById('range-political-opacity')?.value ?? 95,
          opentopo: document.getElementById('range-opentopo-opacity')?.value ?? 85,
          hillshade: document.getElementById('range-hillshade-opacity')?.value ?? 50,
          ignHidroLineal: document.getElementById('range-ign-hidro-lineal-opacity')?.value ?? 85,
          ignHidroPoli: document.getElementById('range-ign-hidro-poli-opacity')?.value ?? 75,
          cadastre: document.getElementById('range-cadastre-opacity')?.value ?? 85,
          roads: document.getElementById('range-roads-opacity')?.value ?? 85,
          landcover: document.getElementById('range-opacity')?.value ?? 65
        },
        baseMap: activeBase,
        camera: {
          center: [map.getCenter().lng, map.getCenter().lat],
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing()
        },
        savedAt: new Date().toISOString()
      };

      setCookie('lusat_session_config', JSON.stringify(config), 365);
      const badge = document.getElementById('session-badge');
      if (badge) {
        badge.innerText = 'SESIÓN: GUARDADA ✓';
        badge.style.color = '#10b981';
      }
    }

    // Restaurar Configuración de Sesión Guardada
    function restoreSessionConfig() {
      const raw = getCookie('lusat_session_config');
      if (!raw) return;

      try {
        const config = JSON.parse(raw);
        if (!config || !config.layers) return;

        // 1. Restaurar Opacidades
        if (config.opacities) {
          if (config.opacities.political) {
            const el = document.getElementById('range-political-opacity');
            if (el) { el.value = config.opacities.political; setPoliticalOpacity(el.value); }
          }
          if (config.opacities.opentopo) {
            const el = document.getElementById('range-opentopo-opacity');
            if (el) { el.value = config.opacities.opentopo; setOpenTopoOpacity(el.value); }
          }
          if (config.opacities.ignHidroLineal) {
            const el = document.getElementById('range-ign-hidro-lineal-opacity');
            if (el) { el.value = config.opacities.ignHidroLineal; setIgnHidroLinealOpacity(el.value); }
          }
          if (config.opacities.ignHidroPoli) {
            const el = document.getElementById('range-ign-hidro-poli-opacity');
            if (el) { el.value = config.opacities.ignHidroPoli; setIgnHidroPoliOpacity(el.value); }
          }
          if (config.opacities.cadastre) {
            const el = document.getElementById('range-cadastre-opacity');
            if (el) { el.value = config.opacities.cadastre; setCadastreOpacity(el.value); }
          }
          if (config.opacities.roads) {
            const el = document.getElementById('range-roads-opacity');
            if (el) { el.value = config.opacities.roads; setRoadsOpacity(el.value); }
          }
          if (config.opacities.landcover) {
            const el = document.getElementById('range-opacity');
            if (el) { el.value = config.opacities.landcover; setLandCoverOpacity(el.value); }
          }
        }

        // 2. Restaurar Activación de Capas
        const l = config.layers;
        if (l.political) {
          const chk = document.getElementById('chk-political');
          if (chk) { chk.checked = true; toggleMasterPolitical(true); }
        }
        if (l.hillshade) {
          const chk = document.getElementById('chk-hillshade');
          if (chk) { chk.checked = true; toggleMasterHillshade(true); }
          if (l.opentopo) { const c = document.getElementById('chk-opentopo'); if(c) { c.checked = true; toggleOpenTopo(true); } }
          if (l.terrain3d) { const c = document.getElementById('chk-terrain-3d'); if(c) { c.checked = true; toggleTerrain3D(true); } }
        }
        if (l.hydro) {
          const chk = document.getElementById('chk-hydro-master');
          if (chk) { chk.checked = true; toggleMasterHydro(true); }
          if (l.ignHidroLineal) { const c = document.getElementById('chk-ign-hidro-lineal'); if(c) { c.checked = true; toggleIgnHidroLineal(true); } }
          if (l.ignHidroPoli) { const c = document.getElementById('chk-ign-hidro-poli'); if(c) { c.checked = true; toggleIgnHidroPoli(true); } }
          if (l.openseamap) { const c = document.getElementById('chk-openseamap'); if(c) { c.checked = true; toggleOpenSeaMap(true); } }
          if (l.inaSim) { const c = document.getElementById('chk-ina-sim'); if(c) { c.checked = true; toggleInaSim(true); } }
          if (l.inaEstaciones) { const c = document.getElementById('chk-ina-estaciones'); if(c) { c.checked = true; toggleInaEstaciones(true); } }
        }
        if (l.oil) {
          const chk = document.getElementById('chk-oil');
          if (chk) { chk.checked = true; toggleMasterOil(true); }
        }
        if (l.mining) {
          const chk = document.getElementById('chk-mining');
          if (chk) { chk.checked = true; toggleMasterMining(true); }
        }
        if (l.cadastre) {
          const chk = document.getElementById('chk-cadastre');
          if (chk) { chk.checked = true; toggleMasterCadastre(true); }
        }
        if (l.roads) {
          const chk = document.getElementById('chk-roads');
          if (chk) { chk.checked = true; toggleMasterRoads(true); }
        }
        if (l.plants) {
          const chk = document.getElementById('chk-plants');
          if (chk) { chk.checked = true; toggleMasterPlants(true); }
        }
        if (l.grid) {
          const chk = document.getElementById('chk-grid');
          if (chk) { chk.checked = true; toggleMasterGrid(true); }
        }
        if (l.gem) {
          const chk = document.getElementById('chk-gem');
          if (chk) { chk.checked = true; toggleMasterGem(true); }
        }
        if (l.landcover) {
          const chk = document.getElementById('chk-landcover');
          if (chk) { chk.checked = true; toggleMasterLandCover(true); }
        }

        // 3. Restaurar Mapa Base
        if (config.baseMap && config.baseMap !== activeBase) {
          setBaseMap(config.baseMap);
        }

        // 4. Restaurar Cámara
        if (config.camera && config.camera.center) {
          map.jumpTo({
            center: config.camera.center,
            zoom: config.camera.zoom || 5.0,
            pitch: config.camera.pitch || 0,
            bearing: config.camera.bearing || 0
          });
        }
      } catch(err) {
        console.warn("Could not restore session config:", err);
      }
    }

    function flyToOpenSeaMap() {
      map.flyTo({ center: [-58.35, -34.58], zoom: 12.5, duration: 1800, essential: true });
      const chkMaster = document.getElementById('chk-hydro-master');
      if (chkMaster && !chkMaster.checked) { chkMaster.checked = true; toggleMasterHydro(true); }
      const chkSea = document.getElementById('chk-openseamap');
      if (chkSea) { chkSea.checked = true; toggleOpenSeaMap(true); }
    }


    // =========================================================
    // LUSAT GEO-COPILOT (GEMINI SPATIAL AI ENGINE)
    // =========================================================
    let isSelectingArea = false;
    let selectionStartPoint = null;
    let activeSelectionBbox = null; // [minLng, minLat, maxLng, maxLat]
    let activeSpatialContext = null;
    let isCopilotThinking = false;

    // Inicializar capas de selección en MapLibre
    function initCopilotMapLayers() {
      if (map.getSource('copilot-bbox-src')) return;

      map.addSource('copilot-bbox-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'copilot-bbox-fill',
        type: 'fill',
        source: 'copilot-bbox-src',
        paint: {
          'fill-color': '#0ea5e9',
          'fill-opacity': 0.18
        }
      });

      map.addLayer({
        id: 'copilot-bbox-line',
        type: 'line',
        source: 'copilot-bbox-src',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2.5,
          'line-dasharray': [3, 2]
        }
      });

      setupMapSelectionListeners();
    }

    // Listeners de arrastre para dibujar el rectángulo
    function setupMapSelectionListeners() {
      const canvas = map.getCanvasContainer();

      canvas.addEventListener('mousedown', (e) => {
        if (!isSelectingArea) return;
        if (e.button !== 0) return; // solo click izquierdo

        const rect = canvas.getBoundingClientRect();
        const p = map.unproject([e.clientX - rect.left, e.clientY - rect.top]);
        selectionStartPoint = [p.lng, p.lat];

        // Bloquear pan y zoom durante el dibujo
        map.dragPan.disable();
        map.boxZoom.disable();
      });

      canvas.addEventListener('mousemove', (e) => {
        if (!isSelectingArea || !selectionStartPoint) return;

        const rect = canvas.getBoundingClientRect();
        const p = map.unproject([e.clientX - rect.left, e.clientY - rect.top]);
        const minLng = Math.min(selectionStartPoint[0], p.lng);
        const maxLng = Math.max(selectionStartPoint[0], p.lng);
        const minLat = Math.min(selectionStartPoint[1], p.lat);
        const maxLat = Math.max(selectionStartPoint[1], p.lat);

        updateSelectionPolygon(minLng, minLat, maxLng, maxLat);
      });

      window.addEventListener('mouseup', (e) => {
        if (!isSelectingArea || !selectionStartPoint) return;

        const rect = canvas.getBoundingClientRect();
        const p = map.unproject([e.clientX - rect.left, e.clientY - rect.top]);
        const minLng = Math.min(selectionStartPoint[0], p.lng);
        const maxLng = Math.max(selectionStartPoint[0], p.lng);
        const minLat = Math.min(selectionStartPoint[1], p.lat);
        const maxLat = Math.max(selectionStartPoint[1], p.lat);

        selectionStartPoint = null;
        finishAreaSelection(minLng, minLat, maxLng, maxLat);
      });
    }

    function updateSelectionPolygon(minLng, minLat, maxLng, maxLat) {
      const poly = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [minLng, minLat],
              [maxLng, minLat],
              [maxLng, maxLat],
              [minLng, maxLat],
              [minLng, minLat]
            ]]
          }
        }]
      };
      if (map.getSource('copilot-bbox-src')) {
        map.getSource('copilot-bbox-src').setData(poly);
      }
    }

    function startAreaSelection() {
      const apiKey = localStorage.getItem('lusat_gemini_api_key');
      if (!apiKey) {
        openApiKeyModal();
        return;
      }

      isSelectingArea = true;
      map.getCanvas().style.cursor = 'crosshair';
      map.dragPan.disable();
      map.boxZoom.disable();

      const btn = document.getElementById('btn-draw-area');
      if (btn) btn.classList.add('active');

      // Feedback visual
      updateCopilotStatus('thinking', 'Dibuja un rectángulo en el mapa...');
    }

    function finishAreaSelection(minLng, minLat, maxLng, maxLat) {
      isSelectingArea = false;
      map.getCanvas().style.cursor = '';
      map.dragPan.enable();
      map.boxZoom.enable();

      const btn = document.getElementById('btn-draw-area');
      if (btn) btn.classList.remove('active');

      // Si el área es muy chica (un solo clic), cancelar
      if (Math.abs(maxLng - minLng) < 0.005 || Math.abs(maxLat - minLat) < 0.005) {
        clearAreaSelection();
        return;
      }

      activeSelectionBbox = [minLng, minLat, maxLng, maxLat];
      document.getElementById('btn-clear-selection').style.display = 'inline-flex';

      // Analizar datos espaciales en memoria
      analyzeSelectedArea(activeSelectionBbox);

      // Abrir panel si estaba cerrado
      openCopilotPanel();
    }

    function selectCurrentViewport() {
      const apiKey = localStorage.getItem('lusat_gemini_api_key');
      if (!apiKey) {
        openApiKeyModal();
        return;
      }

      const bounds = map.getBounds();
      const minLng = bounds.getWest();
      const minLat = bounds.getSouth();
      const maxLng = bounds.getEast();
      const maxLat = bounds.getNorth();

      activeSelectionBbox = [minLng, minLat, maxLng, maxLat];
      updateSelectionPolygon(minLng, minLat, maxLng, maxLat);
      document.getElementById('btn-clear-selection').style.display = 'inline-flex';

      analyzeSelectedArea(activeSelectionBbox);
      openCopilotPanel();
    }

    function clearAreaSelection() {
      activeSelectionBbox = null;
      activeSpatialContext = null;
      if (map.getSource('copilot-bbox-src')) {
        map.getSource('copilot-bbox-src').setData({ type: 'FeatureCollection', features: [] });
      }
      document.getElementById('btn-clear-selection').style.display = 'none';

      document.getElementById('context-area-title').innerText = '📍 Sin área delimitada';
      document.getElementById('context-area-desc').innerText = 'Dibuja un rectángulo en el mapa o haz clic en "Analizar Vista Actual" para interrogar a Gemini sobre cualquier territorio.';
      document.getElementById('context-chips').style.display = 'none';
      updateCopilotStatus('ready', 'Listo · Google Gemini');
    }

    // Extractor y agregador espacial cuantitativo en memoria
    function analyzeSelectedArea(bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox;

      // 1. Superficie aproximada
      const avgLat = (minLat + maxLat) / 2;
      const widthKm = Math.abs(maxLng - minLng) * 111.32 * Math.cos(avgLat * Math.PI / 180);
      const heightKm = Math.abs(maxLat - minLat) * 110.57;
      const areaKm2 = Math.round(widthKm * heightKm);

      // 2. Intersección con Pozos Petroleros
      const wellsInBbox = rawOilWells.filter(f => {
        const [lng, lat] = f.geometry.coordinates;
        return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
      });
      const shaleWells = wellsInBbox.filter(w => w.properties.tipo === 'No Convencional').length;
      const convWells = wellsInBbox.length - shaleWells;

      const operatorCounts = {};
      const formationCounts = {};
      wellsInBbox.forEach(w => {
        const op = w.properties.empresa || w.properties.operador || 'Otros';
        operatorCounts[op] = (operatorCounts[op] || 0) + 1;
        const form = w.properties.formacion || 'No informada';
        formationCounts[form] = (formationCounts[form] || 0) + 1;
      });
      const topOperators = Object.entries(operatorCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);

      // 3. Intersección con Centrales Eléctricas
      const plantsInBbox = rawPowerPlants.filter(f => {
        const [lng, lat] = f.geometry.coordinates;
        return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
      });
      let totalMw = 0;
      const fuelCounts = {};
      plantsInBbox.forEach(p => {
        const mw = parseFloat(p.properties.capacity_mw || 0);
        totalMw += mw;
        const fuel = p.properties.fuel || 'Other';
        fuelCounts[fuel] = (fuelCounts[fuel] || 0) + mw;
      });

      // 4. Intersección con Minería
      const miningInBbox = rawMiningProjects.filter(f => {
        const [lng, lat] = f.geometry.coordinates;
        return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
      });
      const miningMinerals = {};
      miningInBbox.forEach(m => {
        const min = m.properties.mineral || m.properties.tipo || 'Varios';
        miningMinerals[min] = (miningMinerals[min] || 0) + 1;
      });

      // 5. Altimetría aproximada del centro
      const centerElevation = document.getElementById('live-elevation-card')?.innerText || '--';

      // Guardar contexto en memoria
      activeSpatialContext = {
        bbox: { minLng, minLat, maxLng, maxLat },
        center: [((minLng + maxLng)/2).toFixed(4), avgLat.toFixed(4)],
        areaKm2,
        wells: {
          total: wellsInBbox.length,
          shale: shaleWells,
          convencional: convWells,
          topOperators,
          topFormations: Object.entries(formationCounts).sort((a,b) => b[1] - a[1]).slice(0, 4)
        },
        power: {
          totalPlants: plantsInBbox.length,
          totalMw: Math.round(totalMw),
          fuelCounts
        },
        mining: {
          totalProjects: miningInBbox.length,
          minerals: miningMinerals,
          projectsList: miningInBbox.slice(0, 5).map(m => m.properties.nombre || m.properties.name)
        },
        elevation: centerElevation,
        activeBasemap: activeBase
      };

      // Actualizar tarjeta visual de contexto
      document.getElementById('context-area-title').innerText = `📍 Área: ${areaKm2.toLocaleString()} km² [${activeSpatialContext.center[1]}, ${activeSpatialContext.center[0]}]`;
      document.getElementById('context-area-desc').innerText = `Zona delimitada con ${wellsInBbox.length} pozos, ${plantsInBbox.length} centrales eléctricas (${Math.round(totalMw)} MW) y ${miningInBbox.length} proyectos mineros.`;
      
      const chipsEl = document.getElementById('context-chips');
      chipsEl.style.display = 'flex';
      document.getElementById('chip-wells').innerText = `🛢️ ${wellsInBbox.length} Pozos (${shaleWells} Shale)`;
      document.getElementById('chip-plants').innerText = `⚡ ${plantsInBbox.length} Centrales (${Math.round(totalMw)} MW)`;
      document.getElementById('chip-mining').innerText = `⛏️ ${miningInBbox.length} Proyectos Mineros`;
      document.getElementById('chip-elevation').innerText = `🏔️ Cota: ${centerElevation} msnm`;

      updateCopilotStatus('ready', `Área lista (${areaKm2} km²)`);
    }

    // Bottom Drawer & Panel UI Controls
    function toggleBottomDrawer() {
      const drawer = document.getElementById('bottom-drawer');
      if (drawer.classList.contains('collapsed')) {
        drawer.classList.remove('collapsed');
        drawer.classList.add('open');
      } else {
        drawer.classList.add('collapsed');
        drawer.classList.remove('open');
      }
    }

    function toggleBottomDrawer() {
      const drawer = document.getElementById('bottom-drawer');
      if (drawer.classList.contains('open')) {
        closeBottomDrawer();
      } else {
        openBottomDrawer();
      }
    }

    function openBottomDrawer(tabId = null) {
      const drawer = document.getElementById('bottom-drawer');
      drawer.classList.remove('collapsed');
      drawer.classList.add('open');
      if (tabId) switchDrawerTab(tabId);
    }

    function closeBottomDrawer() {
      const drawer = document.getElementById('bottom-drawer');
      drawer.classList.add('collapsed');
      drawer.classList.remove('open');
    }

    function switchDrawerTab(tabId) {
      document.querySelectorAll('.drawer-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.drawer-pane').forEach(p => p.classList.remove('active'));
      const btn = document.getElementById(`tab-btn-${tabId}`);
      const pane = document.getElementById(`pane-${tabId}`);
      if (btn) btn.classList.add('active');
      if (pane) pane.classList.add('active');
    }

    function toggleCopilotPanel() {
      const drawer = document.getElementById('bottom-drawer');
      if (drawer.classList.contains('open')) {
        closeBottomDrawer();
      } else {
        openBottomDrawer('copilot');
        openCopilotLogic();
      }
    }

    function openCopilotLogic() {
      // Autolimpieza y preconfiguración de clave verificada
      const existingKey = localStorage.getItem('lusat_gemini_api_key');
      if (existingKey) {
        const cleanedKey = cleanGeminiKey(existingKey);
        if (cleanedKey !== existingKey) {
          localStorage.setItem('lusat_gemini_api_key', cleanedKey);
        }
      } else {
        localStorage.setItem('lusat_gemini_api_key', 'AQ.Ab8RN6Jxefgwq7m42jPipvHKDfIW8ub4jUZcf-2FNdxXJJonPA');
        localStorage.setItem('lusat_gemini_model', 'gemini-3.5-flash');
      }

      updateCopilotKeyBanner();
      refreshCopilotWelcomeMessage();

      const apiKey = localStorage.getItem('lusat_gemini_api_key');
      if (!apiKey) {
        openApiKeyModal();
      } else {
        const input = document.getElementById('copilot-input');
        if (input) input.focus();
      }
    }

    // Funciones mantenidas por compatibilidad (vacías o re-enrutadas)
    function closeCopilot() { closeBottomDrawer(); }
    function minimizeCopilot() { closeBottomDrawer(); }
    function maximizeCopilot() { openBottomDrawer('copilot'); }

    function updateCopilotStatus(state, text) {
      const dot = document.getElementById('copilot-status-dot');
      const textEl = document.getElementById('copilot-status-text');
      if (!dot || !textEl) return;

      dot.className = '';
      if (state === 'thinking') dot.className = 'copilot-dot-thinking';
      else if (state === 'warning') dot.className = 'copilot-dot-warning';
      else dot.className = 'copilot-dot-ready';

      textEl.innerText = text;
    }

    // Enviar pregunta rápida con un clic
    function sendQuickPrompt(type) {
      if (!activeSpatialContext) {
        selectCurrentViewport();
      }

      const prompts = {
        resumen: 'Haz un resumen ejecutivo y estratégico de todos los activos, recursos y características del área seleccionada.',
        hidrocarburos: 'Analiza los pozos de hidrocarburos de esta zona: operadoras líderes, proporción de no convencional (Vaca Muerta) vs convencional y formaciones geológicas.',
        energia: 'Evalúa la capacidad de generación eléctrica y el balance de combustibles de las centrales en esta área.',
        hidrico: '¿Qué riesgo hídrico o potencial de anegamiento e inundación presenta esta región y qué cuerpos de agua la rodean?',
        mineria: 'Analiza el potencial y los proyectos mineros de litio u otros minerales dentro de este polígono geográfico.'
      };

      const promptText = prompts[type] || 'Resume lo que hay en esta zona.';
      document.getElementById('copilot-input').value = promptText;
      sendCopilotMessage();
    }

    function handleCopilotKeyDown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendCopilotMessage();
      }
    }

    // Envío y comunicación con la API de Google Gemini
    async function sendCopilotMessage() {
      if (isCopilotThinking) return;

      const input = document.getElementById('copilot-input');
      const question = input.value.trim();
      if (!question) return;

      // Verificar clave
      const apiKey = localStorage.getItem('lusat_gemini_api_key');
      if (!apiKey) {
        appendCopilotMessage('user', question);
        input.value = '';
        appendCopilotMessage('system', `
          <div style="line-height:1.5;">
            ⚠️ <b>Se requiere tu Google Gemini API Key gratuita</b> para responder tus consultas.<br/>
            <span style="font-size:10.5px; color:#94a3b8;">Obtén tu clave en 30 segundos sin costo en Google AI Studio.</span>
            <div style="margin-top:10px;">
              <button class="btn-micro" style="background:#0ea5e9; border-color:#38bdf8; color:#ffffff; font-weight:700; padding:8px 14px; font-size:11.5px; cursor:pointer; box-shadow:0 0 12px rgba(14,165,233,0.5); display:inline-flex; align-items:center; gap:6px;" onclick="openApiKeyModal()">
                <span>🔑 Configurar Gemini API Key Gratis Ahora ➔</span>
              </button>
            </div>
          </div>
        `);
        openApiKeyModal();
        return;
      }

      // Si no hay área seleccionada, tomar el viewport actual automáticamente
      if (!activeSpatialContext) {
        selectCurrentViewport();
      }

      appendCopilotMessage('user', question);
      input.value = '';

      isCopilotThinking = true;
      updateCopilotStatus('thinking', 'Gemini está razonando...');
      document.getElementById('copilot-send-btn').disabled = true;

      // Placeholder de mensaje del asistente mientras piensa
      const assistantMsgId = 'copilot-msg-' + Date.now();
      appendCopilotMessage('assistant', '<span class="copilot-dot-thinking">●</span> Analizando coordenadas y procesando inteligencia espacial...', assistantMsgId);

      try {
        const model = localStorage.getItem('lusat_gemini_model') || 'gemini-3.5-flash';
        document.getElementById('copilot-model-badge').innerText = model;

        // Construir prompt estructurado con datos cuantitativos
        const ctx = activeSpatialContext;
        let spatialPrompt = `CONTEXTO ESPACIAL CUANTITATIVO DE LUSAT:
- Superficie delimitada: ${ctx.areaKm2.toLocaleString()} km²
- Centro geográfico: Latitud ${ctx.center[1]}, Longitud ${ctx.center[0]}
- Bounding Box [Oeste, Sur, Este, Norte]: [${ctx.bbox.minLng.toFixed(4)}, ${ctx.bbox.minLat.toFixed(4)}, ${ctx.bbox.maxLng.toFixed(4)}, ${ctx.bbox.maxLat.toFixed(4)}]
- Pozos de Petróleo y Gas identificados: ${ctx.wells.total} pozos totales
  * No Convencionales (Shale / Vaca Muerta): ${ctx.wells.shale}
  * Convencionales: ${ctx.wells.convencional}
  * Operadoras principales: ${ctx.wells.topOperators.map(o => o[0] + ' (' + o[1] + ')').join(', ') || 'Ninguna registrada en este polígono'}
  * Formaciones: ${ctx.wells.topFormations.map(f => f[0] + ' (' + f[1] + ')').join(', ') || 'N/D'}
- Infraestructura de Generación Eléctrica: ${ctx.power.totalPlants} centrales (${ctx.power.totalMw} MW totales)
  * Combustibles: ${Object.entries(ctx.power.fuelCounts).map(([k,v]) => k + ': ' + Math.round(v) + ' MW').join(', ') || 'Sin centrales'}
- Proyectos Mineros y Salares: ${ctx.mining.totalProjects} proyectos
  * Minerales: ${Object.entries(ctx.mining.minerals).map(([k,v]) => k + ': ' + v).join(', ') || 'Ninguno'}
- Cota de elevación aproximada: ${ctx.elevation} msnm
- Mapa base activo: ${ctx.activeBasemap}

INSTRUCCIÓN: Actúa como el analista de inteligencia geoespacial y estratégica de LUSAT. Responde con precisión técnica, estructurando la respuesta en viñetas o apartados claros, basándote en los datos cuantitativos anteriores y tu conocimiento geológico, de infraestructura y de territorio argentino.`;

        const requestParts = [
          { text: spatialPrompt + "\n\nPREGUNTA DEL USUARIO: " + question }
        ];

        // Opción multimodal: Adjuntar captura visual si está tildado
        const includeVision = document.getElementById('chk-copilot-vision')?.checked ?? true;
        if (includeVision) {
          try {
            const canvas = map.getCanvas();
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const base64Data = dataUrl.split(',')[1];
            if (base64Data) {
              requestParts.push({
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data
                }
              });
            }
          } catch (e) {
            console.warn('No se pudo capturar canvas para visión multimodal:', e);
          }
        }

        const cleanKey = cleanGeminiKey(apiKey);
        // Lista priorizada de modelos con fallback automático resiliente
        const fallbackModels = [model, 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-1.5-flash'];
        const uniqueModels = [...new Set(fallbackModels)];
        let successfulData = null;
        let activeWorkingModel = model;
        let lastError = null;

        for (const candidateModel of uniqueModels) {
          try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${candidateModel}:generateContent?key=${encodeURIComponent(cleanKey)}`;
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': cleanKey
              },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: requestParts }],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 1500
                }
              })
            });

            if (response.ok) {
              successfulData = await response.json();
              activeWorkingModel = candidateModel;
              localStorage.setItem('lusat_gemini_model', candidateModel);
              document.getElementById('copilot-model-badge').innerText = candidateModel;
              break;
            } else {
              const errData = await response.json().catch(() => ({}));
              const errMsg = errData.error?.message || response.statusText;
              console.warn(`Fallback Copilot: modelo ${candidateModel} retornó ${response.status}: ${errMsg}`);

              // Si es 404, 503 (demanda alta), 500, o no disponible, probar siguiente modelo
              if (response.status === 404 || response.status === 503 || response.status === 500 || errMsg.includes('not found') || errMsg.includes('high demand') || errMsg.includes('no longer available')) {
                lastError = new Error(`El modelo ${candidateModel} experimenta alta demanda o no está disponible.`);
                continue;
              } else if (response.status === 400 || response.status === 403) {
                throw new Error(`Clave de API con error de permisos (${errMsg}). Verifica tu clave en ⚙️.`);
              } else if (response.status === 429) {
                throw new Error('Cuota gratuita de consultas excedida temporalmente. Espera unos segundos y reintenta.');
              } else {
                lastError = new Error(`Error ${response.status}: ${errMsg}`);
                continue;
              }
            }
          } catch (e) {
            if (e.message.includes('permisos') || e.message.includes('Cuota')) throw e;
            lastError = e;
          }
        }

        if (!successfulData) {
          throw lastError || new Error('No se pudo conectar con ningún modelo compatible para esta clave.');
        }

        const data = successfulData;
        const candidate = data.candidates?.[0];
        const answerText = candidate?.content?.parts?.[0]?.text || 'No se recibió respuesta del modelo.';

        // Reemplazar mensaje de cargando con la respuesta renderizada
        const msgEl = document.getElementById(assistantMsgId);
        if (msgEl) {
          msgEl.innerHTML = `
            <div class="msg-author">🤖 LUSAT Geo-Copilot</div>
            <div class="msg-content">${formatMarkdown(answerText)}</div>
          `;
        }

        updateCopilotStatus('ready', 'Listo · Google Gemini');
      } catch (err) {
        console.error('Error en Geo-Copilot:', err);
        const msgEl = document.getElementById(assistantMsgId);
        if (msgEl) {
          msgEl.innerHTML = `
            <div class="msg-author" style="color:#ef4444;">⚠️ Error en Geo-Copilot</div>
            <div class="msg-content" style="color:#fca5a5;">${err.message}</div>
          `;
        }
        updateCopilotStatus('warning', 'Error en consulta');
      } finally {
        isCopilotThinking = false;
        document.getElementById('copilot-send-btn').disabled = false;
        scrollCopilotToBottom();
      }
    }

    function appendCopilotMessage(role, htmlContent, customId) {
      const container = document.getElementById('copilot-messages');
      const div = document.createElement('div');
      div.className = `copilot-msg msg-${role}`;
      if (customId) div.id = customId;

      if (role === 'user') {
        div.innerHTML = `
          <div class="msg-author" style="color:#38bdf8;">👤 Tú</div>
          <div class="msg-content">${escapeHtml(htmlContent)}</div>
        `;
      } else if (role === 'system') {
        div.innerHTML = `<div class="msg-content">${htmlContent}</div>`;
      } else {
        div.innerHTML = htmlContent;
      }

      container.appendChild(div);
      scrollCopilotToBottom();
    }

    function scrollCopilotToBottom() {
      const container = document.getElementById('copilot-messages');
      if (container) container.scrollTop = container.scrollHeight;
    }

    // Formateador Markdown nativo ligero
    function formatMarkdown(text) {
      if (!text) return '';
      let html = escapeHtml(text);

      // Bloques de código
      html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
      // Código inline
      html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
      // Títulos
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^# (.*$)/gim, '<h3>$1</h3>');
      // Negrita
      html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      // Cursiva
      html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');
      // Viñetas
      html = html.replace(/^\s*[\*\-]\s+(.*$)/gim, '<li>$1</li>');
      html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
      // Saltos de línea
      html = html.replace(/\n/g, '<br/>');

      return html;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Sincronizar estado de clave en la interfaz
    function updateCopilotKeyBanner() {
      const hasKey = !!localStorage.getItem('lusat_gemini_api_key');
      const alertBar = document.getElementById('copilot-key-alert-bar');
      const statusText = document.getElementById('copilot-status-text');
      const statusDot = document.getElementById('copilot-status-dot');
      const input = document.getElementById('copilot-input');

      if (!hasKey) {
        if (alertBar) alertBar.style.display = 'flex';
        if (statusText) statusText.innerText = 'Clave no configurada';
        if (statusDot) { statusDot.className = 'copilot-dot-warning'; }
        if (input) input.placeholder = 'Configura tu API Key en el botón arriba para comenzar a chatear...';
      } else {
        if (alertBar) alertBar.style.display = 'none';
        if (statusText) statusText.innerText = 'Listo · Google Gemini';
        if (statusDot) { statusDot.className = 'copilot-dot-ready'; }
        if (input) input.placeholder = 'Pregunta sobre esta área (ej: ¿quién opera los pozos?)...';
      }
    }

    function refreshCopilotWelcomeMessage() {
      const hasKey = !!localStorage.getItem('lusat_gemini_api_key');
      const welcomeEl = document.getElementById('copilot-welcome-content');
      if (!welcomeEl) return;

      if (!hasKey) {
        welcomeEl.innerHTML = `
          ¡Bienvenido! Para comenzar a interrogar al asistente sobre cualquier territorio, ingresa primero tu <b>API Key gratuita</b> de Google Gemini (1.500 consultas diarias sin costo).
          <div style="margin-top:10px;">
            <button class="btn-micro" style="background:#0ea5e9; border-color:#38bdf8; color:#ffffff; font-weight:700; padding:8px 14px; font-size:11.5px; cursor:pointer; box-shadow:0 0 12px rgba(14,165,233,0.5); display:inline-flex; align-items:center; gap:6px;" onclick="openApiKeyModal()">
              <span>🔑 Configurar Gemini API Key Gratis Ahora ➔</span>
            </button>
          </div>
        `;
      } else {
        welcomeEl.innerHTML = `
          ¡Hola! Clave de Gemini activa. Delimita un rectángulo en el mapa con <b>[ ⛶ Seleccionar Área ]</b> o haz clic en <b>[ 🗺️ Analizar Vista Actual ]</b> para preguntarme sobre pozos de petróleo, centrales de energía, minería o relieve.
        `;
      }
    }

    // Modal de API Key
    function cleanGeminiKey(raw) {
      if (!raw) return '';
      return String(raw)
        .trim()
        .replace(/^["'`]|["'`]$/g, '') // Quita comillas accidentales
        .replace(/\s+/g, '')          // Quita espacios, saltos de línea y tabs
        .trim();
    }

    function openApiKeyModal() {
      const modal = document.getElementById('copilot-key-modal-overlay');
      if (!modal) return;
      modal.style.display = 'flex';
      modal.classList.add('active');

      const input = document.getElementById('gemini-api-key-input');
      const select = document.getElementById('gemini-model-select');
      // Clave preconfigurada probada y operativa
      let currentKey = cleanGeminiKey(localStorage.getItem('lusat_gemini_api_key') || '');
      if (!currentKey) {
        currentKey = 'AQ.Ab8RN6Jxefgwq7m42jPipvHKDfIW8ub4jUZcf-2FNdxXJJonPA';
        localStorage.setItem('lusat_gemini_api_key', currentKey);
      }
      const currentModel = localStorage.getItem('lusat_gemini_model') || 'gemini-3.5-flash';

      if (input) input.value = currentKey;
      if (select) select.value = currentModel;
      const resEl = document.getElementById('key-test-result');
      if (resEl) resEl.style.display = 'none';

      setTimeout(() => { if (input) input.focus(); }, 60);
    }

    function closeApiKeyModal() {
      const modal = document.getElementById('copilot-key-modal-overlay');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    function toggleKeyVisibility() {
      const input = document.getElementById('gemini-api-key-input');
      input.type = input.type === 'password' ? 'text' : 'password';
    }

    function saveGeminiApiKey() {
      const rawKey = document.getElementById('gemini-api-key-input').value;
      const key = cleanGeminiKey(rawKey);
      const model = document.getElementById('gemini-model-select').value;

      if (!key) {
        alert('Por favor, ingresa una clave de API válida.');
        return;
      }

      localStorage.setItem('lusat_gemini_api_key', key);
      localStorage.setItem('lusat_gemini_model', model);
      document.getElementById('copilot-model-badge').innerText = model;

      updateCopilotStatus('ready', 'Clave guardada · Google Gemini');
      updateCopilotKeyBanner();
      refreshCopilotWelcomeMessage();
      closeApiKeyModal();
      openCopilotPanel();
    }

    function deleteGeminiApiKey() {
      if (confirm('¿Deseas eliminar la clave de API de Gemini guardada en este navegador?')) {
        localStorage.removeItem('lusat_gemini_api_key');
        document.getElementById('gemini-api-key-input').value = '';
        updateCopilotStatus('warning', 'Clave no configurada');
        updateCopilotKeyBanner();
        refreshCopilotWelcomeMessage();
        closeApiKeyModal();
      }
    }

    async function testGeminiConnection() {
      const rawKey = document.getElementById('gemini-api-key-input').value;
      const key = cleanGeminiKey(rawKey);
      document.getElementById('gemini-api-key-input').value = key; // Sanitizar en vivo el campo

      const modelSelect = document.getElementById('gemini-model-select');
      const selectedModel = modelSelect.value;
      const resEl = document.getElementById('key-test-result');

      if (!key) {
        resEl.style.display = 'block';
        resEl.style.background = 'rgba(239, 68, 68, 0.15)';
        resEl.style.color = '#fca5a5';
        resEl.innerText = 'Ingresa una clave para probar.';
        return;
      }

      resEl.style.display = 'block';
      resEl.style.background = 'rgba(56, 189, 248, 0.15)';
      resEl.style.color = '#38bdf8';
      resEl.innerText = 'Probando conexión con Google Gemini API...';

      // Probar prioritariamente gemini-3.5-flash y gemini-3.5-flash-lite (100% estables)
      const candidateModels = [selectedModel, 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-1.5-flash'];
      const uniqueCandidates = [...new Set(candidateModels)];
      let successModel = null;
      let lastErrMsg = '';

      for (const m of uniqueCandidates) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`;
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': key
            },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: 'Di: OK' }] }],
              generationConfig: { maxOutputTokens: 10 }
            })
          });

          if (resp.ok) {
            successModel = m;
            break;
          } else {
            const err = await resp.json().catch(() => ({}));
            lastErrMsg = err.error?.message || resp.statusText;
            console.warn(`Intento con modelo ${m} falló:`, resp.status, lastErrMsg);

            // Si es error de demanda alta (503), 404, o temporal, probar siguiente modelo
            if (resp.status === 503 || resp.status === 404 || resp.status === 500 || lastErrMsg.includes('high demand') || lastErrMsg.includes('not found')) {
              continue;
            }
            if (resp.status === 400 && lastErrMsg.includes('API_KEY_INVALID')) {
              break;
            }
          }
        } catch (e) {
          lastErrMsg = e.message;
        }
      }

      if (successModel) {
        modelSelect.value = successModel;
        localStorage.setItem('lusat_gemini_model', successModel);
        resEl.style.background = 'rgba(16, 185, 129, 0.2)';
        resEl.style.color = '#10b981';
        resEl.innerHTML = `✅ <b>¡Conexión exitosa!</b> Tu clave funciona a la perfección con el modelo <b>${successModel}</b>.<br/>Haz clic en <b>"Guardar y Usar"</b> para activar el Geo-Copilot.`;
      } else {
        resEl.style.background = 'rgba(239, 68, 68, 0.2)';
        resEl.style.color = '#fca5a5';
        if (lastErrMsg.includes('OAuth 2') || lastErrMsg.includes('API_KEY_SERVICE_BLOCKED') || lastErrMsg.includes('Expected OAuth')) {
          resEl.innerHTML = `❌ <b>Error de autenticación Google:</b><br/>
            Esta clave requiere credenciales OAuth o fue creada en Google Cloud sin la API <i>Generative Language</i>.<br/>
            👉 <b>Solución recomendada (100% gratuita y sin restricciones):</b><br/>
            Genera una clave directa en <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#38bdf8; text-decoration:underline; font-weight:700;">Google AI Studio</a> (inician con <code>AIzaSy...</code>).`;
        } else {
          resEl.innerText = '❌ Error de conexión: ' + lastErrMsg;
        }
      }
    }

        // =========================================================
    // CONTROL DE ACORDEONES & CAPAS
    // =========================================================
    function toggleDropdown(layerKey) {
      const dd = document.getElementById('dropdown-' + layerKey);
      const caret = document.getElementById('caret-' + layerKey);
      if (!dd) return;

      const isCollapsed = dd.classList.contains('collapsed');
      if (isCollapsed) {
        dd.classList.remove('collapsed');
        if (caret) caret.classList.add('open');
      } else {
        dd.classList.add('collapsed');
        if (caret) caret.classList.remove('open');
      }
    }


    // =========================================================
    // CONTROL DE HIDROGRAFÍA OFICIAL & CRECIDAS (IGN / INA)
    // =========================================================
    // isHydroMasterVisible declared above

    function toggleMasterHydro(enabled) {
      isHydroMasterVisible = enabled;
      const dd = document.getElementById('dropdown-hydro');
      
      if (enabled) {
        if (dd) dd.classList.remove('disabled');
        // Si ninguna sub-capa estaba marcada, encendemos ríos y lagos por defecto
        const chkLineal = document.getElementById('chk-ign-hidro-lineal');
        const chkPoli = document.getElementById('chk-ign-hidro-poli');
        const chkSea = document.getElementById('chk-openseamap');
        const chkSim = document.getElementById('chk-ina-sim');
        const chkEst = document.getElementById('chk-ina-estaciones');
        if (chkLineal && chkPoli && !chkLineal.checked && !chkPoli.checked && (!chkSea || !chkSea.checked) && (!chkSim || !chkSim.checked) && (!chkEst || !chkEst.checked)) {
          chkLineal.checked = true;
          chkPoli.checked = true;
        }
      } else {
        if (dd) dd.classList.add('disabled');
      }

      if (map.getLayer('ign-hidro-lineal-layer')) {
        const linealOn = document.getElementById('chk-ign-hidro-lineal')?.checked ?? false;
        map.setLayoutProperty('ign-hidro-lineal-layer', 'visibility', (enabled && linealOn) ? 'visible' : 'none');
      }
      if (map.getLayer('ign-hidro-poli-layer')) {
        const poliOn = document.getElementById('chk-ign-hidro-poli')?.checked ?? false;
        map.setLayoutProperty('ign-hidro-poli-layer', 'visibility', (enabled && poliOn) ? 'visible' : 'none');
      }
      if (map.getLayer('openseamap-layer')) {
        const seaOn = document.getElementById('chk-openseamap')?.checked ?? false;
        map.setLayoutProperty('openseamap-layer', 'visibility', (enabled && seaOn) ? 'visible' : 'none');
      }
      if (map.getLayer('ina-sim-layer')) {
        const simOn = document.getElementById('chk-ina-sim')?.checked ?? false;
        map.setLayoutProperty('ina-sim-layer', 'visibility', (enabled && simOn) ? 'visible' : 'none');
      }
      if (map.getLayer('ina-estaciones-layer')) {
        const estOn = document.getElementById('chk-ina-estaciones')?.checked ?? false;
        map.setLayoutProperty('ina-estaciones-layer', 'visibility', (enabled && estOn) ? 'visible' : 'none');
      }

      const statusEl = document.getElementById('hydro-status');
      if (statusEl) {
        statusEl.innerText = enabled ? 'IGN/INA' : 'INACTIVO';
        statusEl.style.color = enabled ? '#0ea5e9' : '#64748b';
      }
      saveSessionConfig();
    }

    function toggleIgnHidroLineal(enabled) {
      if (enabled && !isHydroMasterVisible) {
        const master = document.getElementById('chk-hydro-master');
        if (master) master.checked = true;
        isHydroMasterVisible = true;
        const dd = document.getElementById('dropdown-hydro');
        if (dd) dd.classList.remove('disabled');
        const statusEl = document.getElementById('hydro-status');
        if (statusEl) { statusEl.innerText = 'IGN/INA'; statusEl.style.color = '#0ea5e9'; }
      }
      if (map.getLayer('ign-hidro-lineal-layer')) {
        map.setLayoutProperty('ign-hidro-lineal-layer', 'visibility', (enabled && isHydroMasterVisible) ? 'visible' : 'none');
      }
      saveSessionConfig();
    }

    function setIgnHidroLinealOpacity(val) {
      const opacity = parseFloat(val) / 100;
      const valEl = document.getElementById('ign-hidro-lineal-opacity-val');
      if (valEl) valEl.innerText = val + '%';
      if (map.getLayer('ign-hidro-lineal-layer')) {
        map.setPaintProperty('ign-hidro-lineal-layer', 'raster-opacity', opacity);
      }
      saveSessionConfig();
    }

    function toggleIgnHidroPoli(enabled) {
      if (enabled && !isHydroMasterVisible) {
        const master = document.getElementById('chk-hydro-master');
        if (master) master.checked = true;
        isHydroMasterVisible = true;
        const dd = document.getElementById('dropdown-hydro');
        if (dd) dd.classList.remove('disabled');
        const statusEl = document.getElementById('hydro-status');
        if (statusEl) { statusEl.innerText = 'IGN/INA'; statusEl.style.color = '#0ea5e9'; }
      }
      if (map.getLayer('ign-hidro-poli-layer')) {
        map.setLayoutProperty('ign-hidro-poli-layer', 'visibility', (enabled && isHydroMasterVisible) ? 'visible' : 'none');
      }
      saveSessionConfig();
    }

    function setIgnHidroPoliOpacity(val) {
      const opacity = parseFloat(val) / 100;
      const valEl = document.getElementById('ign-hidro-poli-opacity-val');
      if (valEl) valEl.innerText = val + '%';
      if (map.getLayer('ign-hidro-poli-layer')) {
        map.setPaintProperty('ign-hidro-poli-layer', 'raster-opacity', opacity);
      }
      saveSessionConfig();
    }

    function toggleOpenSeaMap(enabled) {
      if (enabled && !isHydroMasterVisible) {
        const master = document.getElementById('chk-hydro-master');
        if (master) master.checked = true;
        isHydroMasterVisible = true;
        const dd = document.getElementById('dropdown-hydro');
        if (dd) dd.classList.remove('disabled');
        const statusEl = document.getElementById('hydro-status');
        if (statusEl) { statusEl.innerText = 'IGN/INA'; statusEl.style.color = '#0ea5e9'; }
      }
      if (map.getLayer('openseamap-layer')) {
        map.setLayoutProperty('openseamap-layer', 'visibility', (enabled && isHydroMasterVisible) ? 'visible' : 'none');
      }
      saveSessionConfig();
    }

    function toggleInaSim(enabled) {
      if (enabled && !isHydroMasterVisible) {
        const master = document.getElementById('chk-hydro-master');
        if (master) master.checked = true;
        isHydroMasterVisible = true;
        const dd = document.getElementById('dropdown-hydro');
        if (dd) dd.classList.remove('disabled');
        const statusEl = document.getElementById('hydro-status');
        if (statusEl) { statusEl.innerText = 'IGN/INA'; statusEl.style.color = '#0ea5e9'; }
      }
      if (map.getLayer('ina-sim-layer')) {
        map.setLayoutProperty('ina-sim-layer', 'visibility', (enabled && isHydroMasterVisible) ? 'visible' : 'none');
      }
      saveSessionConfig();
    }

    function toggleInaEstaciones(enabled) {
      if (enabled && !isHydroMasterVisible) {
        const master = document.getElementById('chk-hydro-master');
        if (master) master.checked = true;
        isHydroMasterVisible = true;
        const dd = document.getElementById('dropdown-hydro');
        if (dd) dd.classList.remove('disabled');
        const statusEl = document.getElementById('hydro-status');
        if (statusEl) { statusEl.innerText = 'IGN/INA'; statusEl.style.color = '#0ea5e9'; }
      }
      if (map.getLayer('ina-estaciones-layer')) {
        map.setLayoutProperty('ina-estaciones-layer', 'visibility', (enabled && isHydroMasterVisible) ? 'visible' : 'none');
      }
      saveSessionConfig();
    }

    // =========================================================
    // CONTROL DE ALTIMETRÍA, CURVAS DE NIVEL & RELIEVE 3D
    // =========================================================
    let is3dTerrainMeshActive = true;
    let currentTerrainExaggeration = 1.4;

    function toggleMasterHillshade(enabled) { saveSessionConfig();
      isHillshadeMasterVisible = enabled;
      const v = enabled ? 'visible' : 'none';
      
      if (map.getLayer('opentopo-layer')) map.setLayoutProperty('opentopo-layer', 'visibility', v);
      if (map.getLayer('hillshade-layer')) map.setLayoutProperty('hillshade-layer', 'visibility', v);
      
      if (enabled) {
        if (is3dTerrainMeshActive) map.setTerrain({ source: 'terrain-dem', exaggeration: currentTerrainExaggeration });
        else map.setTerrain({ source: 'terrain-dem', exaggeration: 0.0001 });
      } else {
        map.setTerrain({ source: 'terrain-dem', exaggeration: 0.0001 });
      }

      const dd = document.getElementById('dropdown-hillshade');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');

      document.getElementById('hillshade-status').innerText = enabled ? 'ACTIVO' : 'INACTIVO';
      document.getElementById('hillshade-status').style.color = enabled ? '#10b981' : '#64748b';
    }

    function toggleOpenTopo(enabled) { saveSessionConfig();
      if (map.getLayer('opentopo-layer')) {
        map.setLayoutProperty('opentopo-layer', 'visibility', enabled ? 'visible' : 'none');
      }
    }

    function setOpenTopoOpacity(val) { saveSessionConfig();
      const opacity = parseFloat(val) / 100;
      document.getElementById('opentopo-opacity-val').innerText = val + '%';
      if (map.getLayer('opentopo-layer')) {
        map.setPaintProperty('opentopo-layer', 'raster-opacity', opacity);
      }
    }

    function toggleTerrain3D(enabled) {
      is3dTerrainMeshActive = enabled;
      if (enabled) {
        map.setTerrain({ source: 'terrain-dem', exaggeration: currentTerrainExaggeration });
      } else {
        // Exaggeration 0.0001 preserves flat 2D appearance while queryTerrainElevation keeps sampling altitude
        map.setTerrain({ source: 'terrain-dem', exaggeration: 0.0001 });
      }
    }

    function setTerrainExaggeration(val) {
      const exagg = parseFloat(val) / 10;
      currentTerrainExaggeration = exagg;
      document.getElementById('terrain-exagg-val').innerText = exagg.toFixed(1) + 'x';
      if (is3dTerrainMeshActive && isHillshadeMasterVisible) {
        map.setTerrain({ source: 'terrain-dem', exaggeration: exagg });
      }
    }

    function toggleEsriHillshade(enabled) {
      if (map.getLayer('hillshade-layer')) {
        map.setLayoutProperty('hillshade-layer', 'visibility', enabled ? 'visible' : 'none');
      }
    }

    function setHillshadeOpacity(val) { saveSessionConfig();
      const opacity = parseFloat(val) / 100;
      document.getElementById('hillshade-opacity-val').innerText = val + '%';
      if (map.getLayer('hillshade-layer')) {
        map.setPaintProperty('hillshade-layer', 'raster-opacity', opacity);
      }
    }

    function toggleIgnMde(enabled) { saveSessionConfig();
      if (map.getLayer('ign-mde-layer')) {
        map.setLayoutProperty('ign-mde-layer', 'visibility', enabled ? 'visible' : 'none');
      }
    }

    function setCameraPerspective(pitch, bearing) {
      map.easeTo({ pitch: pitch, bearing: bearing, duration: 1200 });
    }

    function toggle3DPerspective() {
      const currentPitch = map.getPitch();
      if (currentPitch < 25) {
        map.easeTo({ pitch: 58, bearing: 25, duration: 1200 });
      } else {
        map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
      }
    }

    function flyToRelief(key) {
      const spots = {
        aconcagua: { center: [-69.95, -32.65], zoom: 11.8, pitch: 64, bearing: 55 },
        humahuaca: { center: [-65.35, -23.20], zoom: 11.2, pitch: 58, bearing: 30 },
        vacamuerta: { center: [-68.78, -38.35], zoom: 10.2, pitch: 52, bearing: 35 },
        delta: { center: [-58.55, -34.25], zoom: 11.5, pitch: 42, bearing: 15 }
      };
      if (spots[key]) {
        map.flyTo({ ...spots[key], duration: 2000, essential: true });
      }
    }

    // Toggle Pozos & Cuencas Hidrocarburíferas
    async function toggleMasterOil(enabled) { saveSessionConfig();
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
    }

    function toggleCuencasPoly(enabled) {
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('cuencas-oil-fill')) map.setLayoutProperty('cuencas-oil-fill', 'visibility', v);
      if (map.getLayer('cuencas-oil-line')) map.setLayoutProperty('cuencas-oil-line', 'visibility', v);
    }

    async function applyOilFilters() {
      if (!isOilMasterVisible) return;
      applySpatialFiltersAll();
    }

    // Toggle Minería & Litio
    async function toggleMasterMining(enabled) { saveSessionConfig();
      isMiningMasterVisible = enabled;
      if (enabled) await applyMiningFilters();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('mining-projects-layer')) map.setLayoutProperty('mining-projects-layer', 'visibility', v);
      const dd = document.getElementById('dropdown-mining');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }

    async function applyMiningFilters() {
      if (!isMiningMasterVisible) return;
      if (rawMiningProjects.length === 0) {
          try {
              const res = await fetch('datasets/mining_lithium_projects_argentina.geojson');
              const data = await res.json();
              rawMiningProjects = data.features || [];
          } catch(e) { console.error("Error loading mining", e); return; }
      }
      const fLit = document.getElementById('chk-min-lithium').checked;
      const fCop = document.getElementById('chk-min-copper').checked;
      const fPrec = document.getElementById('chk-min-precious').checked;
      const fOth = document.getElementById('chk-min-other').checked;

      const allowed = [];
      if (fLit) allowed.push('Litio');
      if (fCop) allowed.push('Cobre');
      if (fPrec) { allowed.push('Oro'); allowed.push('Plata'); }
      if (fOth) { allowed.push('Uranio'); allowed.push('Potasio'); allowed.push('Hierro'); allowed.push('Plomo'); allowed.push('Carbón'); }

      if (map.getLayer('mining-projects-layer')) {
        map.setFilter('mining-projects-layer', ['in', ['get', 'mineral'], ['literal', allowed]]);
      }
    }

    // Toggle Esquema Político
    function toggleMasterPolitical(enabled) { saveSessionConfig();
      isPoliticalMasterVisible = enabled;
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('political-reference-layer')) map.setLayoutProperty('political-reference-layer', 'visibility', v);
      const dd = document.getElementById('dropdown-political');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }

    function setPoliticalOpacity(val) { saveSessionConfig();
      const opacity = parseFloat(val) / 100;
      document.getElementById('political-opacity-val').innerText = val + '%';
      if (map.getLayer('political-reference-layer')) {
        map.setPaintProperty('political-reference-layer', 'raster-opacity', opacity);
      }
    }

    // Toggle Catastro
    function toggleMasterCadastre(enabled) { saveSessionConfig();
      isCadastreMasterVisible = enabled;
      const dd = document.getElementById('dropdown-cadastre');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
      applyCadastreFilters();
    }

    function applyCadastreFilters() {
      if (!isCadastreMasterVisible) {
        ['cadastre-formosa-layer', 'cadastre-cordoba-layer', 'cadastre-santafe-layer'].forEach(l => {
          if (map.getLayer(l)) map.setLayoutProperty(l, 'visibility', 'none');
        });
        return;
      }
      const fFor = document.getElementById('chk-cadastre-formosa').checked;
      const fCor = document.getElementById('chk-cadastre-cordoba').checked;
      const fSfe = document.getElementById('chk-cadastre-santafe').checked;

      const forVis = fFor ? 'visible' : 'none';
      if (map.getLayer('cadastre-formosa-layer')) map.setLayoutProperty('cadastre-formosa-layer', 'visibility', forVis);
      if (map.getLayer('cadastre-cordoba-layer')) map.setLayoutProperty('cadastre-cordoba-layer', 'visibility', fCor ? 'visible' : 'none');
      if (map.getLayer('cadastre-santafe-layer')) map.setLayoutProperty('cadastre-santafe-layer', 'visibility', fSfe ? 'visible' : 'none');
    }

    function setCadastreOpacity(val) { saveSessionConfig();
      const opacity = parseFloat(val) / 100;
      document.getElementById('cadastre-opacity-val').innerText = val + '%';
      ['cadastre-formosa-layer', 'cadastre-cordoba-layer', 'cadastre-santafe-layer'].forEach(l => {
        if (map.getLayer(l)) map.setPaintProperty(l, 'raster-opacity', opacity);
      });
    }

    function flyToCadastre(prov) {
      const targets = {
        formosa: { center: [-58.175, -26.185], zoom: 12 },
        cordoba: { center: [-64.185, -31.415], zoom: 12 },
        santafe: { center: [-60.700, -31.633], zoom: 12 }
      };
      if (targets[prov]) {
        map.flyTo({ ...targets[prov], duration: 1500, essential: true });
      }
    }

    // Toggle Red Vial
    function toggleMasterRoads(enabled) { saveSessionConfig();
      isRoadsMasterVisible = enabled;
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('roads-vector-line')) map.setLayoutProperty('roads-vector-line', 'visibility', v);
      if (map.getLayer('roads-raster-overlay')) map.setLayoutProperty('roads-raster-overlay', 'visibility', v);
      if (map.getLayer('rural-roads-line')) map.setLayoutProperty('rural-roads-line', 'visibility', v);
      const dd = document.getElementById('dropdown-roads');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }

    function applyRoadFilters() {
      const fNat = document.getElementById('chk-roads-nat').checked;
      const fProv = document.getElementById('chk-roads-prov').checked;
      const fMun = document.getElementById('chk-roads-mun').checked;
      const fRural = document.getElementById('chk-roads-rural').checked;

      const allowedCats = [];
      if (fNat) allowedCats.push('Ruta Nacional');
      if (fProv) allowedCats.push('Ruta Provincial');

      if (map.getLayer('roads-vector-line')) {
        map.setFilter('roads-vector-line', ['in', ['get', 'cat'], ['literal', allowedCats]]);
      }
      if (map.getLayer('roads-raster-overlay')) {
        map.setLayoutProperty('roads-raster-overlay', 'visibility', (fMun || fRural) ? 'visible' : 'none');
      }
    }

    function setRoadsOpacity(val) { saveSessionConfig();
      const opacity = parseFloat(val) / 100;
      document.getElementById('roads-opacity-val').innerText = val + '%';
      if (map.getLayer('roads-raster-overlay')) map.setPaintProperty('roads-raster-overlay', 'raster-opacity', opacity);
    }

    // Descarga en Vivo de Caminos Rurales
    async function fetchLiveRuralRoads() {
      const zoom = map.getZoom();
      if (zoom < 10) {
        alert('Haz zoom a nivel campo (zoom >= 10) para descargar caminos locales sin saturar el servidor.');
        return;
      }
      const b = map.getBounds();
      const s = b.getSouth().toFixed(4), w = b.getWest().toFixed(4), n = b.getNorth().toFixed(4), e = b.getEast().toFixed(4);
      const overpassQuery = `[out:json][timeout:15];(way["highway"~"track|unclassified|path|service"](${s},${w},${n},${e}););out geom 800;`;
      const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(overpassQuery);

      try {
        const resp = await fetch(url);
        const data = await resp.json();
        const features = (data.elements || []).filter(el => el.geometry && el.geometry.length > 1).map(el => ({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: el.geometry.map(pt => [pt.lon, pt.lat]) },
          properties: { name: el.tags?.name || 'Camino Rural / Huella', surface: el.tags?.surface || 'Tierra', hwy: el.tags?.highway || 'track', access: el.tags?.access || 'Público' }
        }));
        const src = map.getSource('rural-roads-dynamic');
        if (src) src.setData({ type: 'FeatureCollection', features: features });
        alert(`✓ ${features.length} caminos rurales y huellas descargados en la zona!`);
      } catch (err) {
        console.error(err);
      }
    }

    async function applyPowerPlantFilters() {
      if (!isPlantsMasterVisible) return;
      applySpatialFiltersAll();
    }

    // Toggle Centrales Eléctricas
    async function toggleMasterPlants(enabled) { saveSessionConfig();
      isPlantsMasterVisible = enabled;
      if (enabled) await applyPowerPlantFilters();
      if (map.getLayer('plants-layer')) map.setLayoutProperty('plants-layer', 'visibility', enabled ? 'visible' : 'none');
      const dd = document.getElementById('dropdown-plants');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }

    async function toggleMasterGrid(enabled) { saveSessionConfig();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('osm-lines')) map.setLayoutProperty('osm-lines', 'visibility', v);
      const dd = document.getElementById('dropdown-grid');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }

    async function toggleMasterGem(enabled) { saveSessionConfig();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('gem-lines')) map.setLayoutProperty('gem-lines', 'visibility', v);
      const dd = document.getElementById('dropdown-gem');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }

    // ==========================================
    // AIS STREAM MARITIME TRACKING
    // ==========================================
    let aisSocket = null;
    let activeShips = new Map();



    let aisUpdateInterval = null;
    let isAisMasterVisible = false;

    function openAisKeyModal() {
      const modal = document.getElementById('ais-key-modal-overlay');
      if (!modal) return;
      modal.style.display = 'flex';
      modal.classList.add('active');
      const input = document.getElementById('ais-api-key-input');
      const currentKey = localStorage.getItem('lusat_ais_api_key') || '';
      if (input) input.value = currentKey;
      setTimeout(() => { if (input) input.focus(); }, 60);
    }

    function closeAisKeyModal() {
      const modal = document.getElementById('ais-key-modal-overlay');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    function saveAisApiKey() {
      const rawKey = document.getElementById('ais-api-key-input').value;
      const key = rawKey.trim();
      if (!key) { alert('Ingresa una API Key válida.'); return; }
      localStorage.setItem('lusat_ais_api_key', key);
      closeAisKeyModal();
      // Si el switch está encendido, reconectar
      const chk = document.getElementById('chk-ais');
      if (chk && chk.checked) {
        connectAisStream();
      } else if (chk) {
        chk.checked = true;
        toggleMasterAis(true);
      }
    }

    function deleteAisApiKey() {
      localStorage.removeItem('lusat_ais_api_key');
      document.getElementById('ais-api-key-input').value = '';
      closeAisKeyModal();
      disconnectAisStream();
      const chk = document.getElementById('chk-ais');
      if (chk) chk.checked = false;
    }

    function toggleMasterAis(enabled) { 
      saveSessionConfig();
      isAisMasterVisible = enabled;
      const dd = document.getElementById('dropdown-ais');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');

      if (enabled) {
        connectAisStream();
      } else {
        disconnectAisStream();
      }
      
      updateAisMapSource();
    }

    function getShipTypeName(type) {
      if (!type) return 'Desconocido';
      if (type >= 20 && type <= 29) return 'Vehículo de Efecto de Suelo';
      if (type == 30) return 'Pesquero';
      if (type >= 31 && type <= 32) return 'Remolcador';
      if (type == 33) return 'Draga / Operaciones Submarinas';
      if (type == 34) return 'Operaciones de Buceo';
      if (type == 35) return 'Militar / Operaciones Navales';
      if (type == 36) return 'Velero';
      if (type == 37) return 'Embarcación de Recreo (Yate)';
      if (type >= 40 && type <= 49) return 'Nave de Alta Velocidad (HSC)';
      if (type == 50) return 'Buque Piloto';
      if (type == 51) return 'Búsqueda y Rescate (SAR)';
      if (type == 52) return 'Remolcador';
      if (type >= 53 && type <= 59) return 'Embarcación Portuaria / Local';
      if (type >= 60 && type <= 69) return 'Buque de Pasajeros / Crucero';
      if (type >= 70 && type <= 79) return 'Carguero';
      if (type >= 80 && type <= 89) return 'Petrolero / Tanquero';
      if (type >= 90 && type <= 99) return 'Otro Tipo de Buque';
      return 'Embarcación Comercial (' + type + ')';
    }


    async function loadAisSnapshot() {
      try {
        const res = await fetch('datasets/ais_snapshot.geojson?' + Date.now());
        if (!res.ok) return;
        const data = await res.json();
        
        data.features.forEach(f => {
          const p = f.properties;
          const coords = f.geometry.coordinates;
          if (p.mmsi && coords) {
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
          }
        });
        updateAisMapSource();
      } catch(e) {}
    }

    async function connectAisStream() {
      if (activeShips.size === 0) {
        await loadAisSnapshot();
      }

      const apiKey = localStorage.getItem('lusat_ais_api_key');
      if (!apiKey) {
        openAisKeyModal();
        return;
      }
      
      if (aisSocket) disconnectAisStream();

      const ind = document.getElementById('ais-status-indicator');
      if (ind) ind.innerHTML = '(🟡 Conectando...)';

      aisSocket = new WebSocket("wss://stream.aisstream.io/v0/stream");
      
      aisSocket.onopen = function() {
        console.log("AIS WebSocket Open");
        const subscriptionMessage = {
          APIKey: apiKey,
          BoundingBoxes: [[[-60.0, -80.0], [-20.0, -35.0]]]
        };
        aisSocket.send(JSON.stringify(subscriptionMessage));
        
        if (ind) ind.innerHTML = '(🟢 Conectado: 0 buques)';

        if (aisUpdateInterval) clearInterval(aisUpdateInterval);
        aisUpdateInterval = setInterval(updateAisMapSource, 2000);
      };

      let msgCount = 0;
      aisSocket.onmessage = async function(event) {
        try {
          let textData = event.data;
          
          if (event.data instanceof Blob) {
            textData = await event.data.text();
          } else if (event.data instanceof ArrayBuffer) {
            const decoder = new TextDecoder('utf-8');
            textData = decoder.decode(event.data);
          } else if (typeof event.data === 'object') {
            textData = JSON.stringify(event.data);
          }

          if (typeof textData !== 'string') {
            textData = String(textData);
          }
          
          const aisMessage = JSON.parse(textData);
          
          // Debugging errors from server
          if (typeof aisMessage.Message === "string" && aisMessage.Message.includes("error")) {
            console.error("AIS SERVER ERROR:", aisMessage.Message);
          }

          const type = aisMessage.MessageType;
          const meta = aisMessage.MetaData;
          
          if (type === "ShipStaticData") {
            const staticData = aisMessage.Message.ShipStaticData;
            if (activeShips.has(meta.MMSI)) {
              const ship = activeShips.get(meta.MMSI);
              ship.shipTypeString = getShipTypeName(staticData.Type);
              ship.destination = staticData.Destination ? staticData.Destination.trim() : 'No Reportado';
              ship.eta = staticData.Eta ? `${staticData.Eta.Month}/${staticData.Eta.Day} ${staticData.Eta.Hour}:${staticData.Eta.Minute}` : 'N/A';
              if (staticData.Dimension) {
                ship.length = staticData.Dimension.A + staticData.Dimension.B;
                ship.beam = staticData.Dimension.C + staticData.Dimension.D;
              }
            }
            return;
          }

          let shipClass = null;
          let pos = null;
          
          if (type === "PositionReport") {
            shipClass = 'A';
            pos = aisMessage.Message.PositionReport;
          } else if (type === "StandardClassBPositionReport" || type === "ExtendedClassBPositionReport") {
            shipClass = 'B';
            pos = aisMessage.Message[type];
          }

          if (shipClass && pos) {
            const existing = activeShips.get(meta.MMSI) || {};
            activeShips.set(meta.MMSI, {
              mmsi: meta.MMSI,
              shipClass: shipClass,
              name: meta.ShipName ? meta.ShipName.trim() : existing.name || 'Desconocido',
              lat: pos.Latitude,
              lng: pos.Longitude,
              cog: pos.Cog || 0,
              sog: pos.Sog || 0,
              timestamp: Date.now(),
              shipTypeString: existing.shipTypeString || getShipTypeName(0),
              destination: existing.destination || 'Esperando Datos Estáticos...',
              eta: existing.eta || 'N/A',
              length: existing.length || 0,
              beam: existing.beam || 0
            });
            if (Math.random() < 0.005) console.log("AIS Posición Recibida:", shipClass, meta.ShipName || meta.MMSI);
          }
        } catch (err) {
          console.error("Error en onmessage AIS:", err);
        }
      };

      aisSocket.onerror = function(err) {
        console.error("AisStream WebSocket Error: ", err);
        if (ind) ind.innerHTML = '(🔴 Error)';
      };
      
      aisSocket.onclose = function() {
        if (aisUpdateInterval) clearInterval(aisUpdateInterval);
        if (ind) ind.innerHTML = '(🔴 Desconectado)';
      };
    }

    function disconnectAisStream() {
      if (aisSocket) {
        aisSocket.close();
        aisSocket = null;
      }
      if (aisUpdateInterval) {
        clearInterval(aisUpdateInterval);
        aisUpdateInterval = null;
      }
      activeShips.clear();
      updateAisMapSource();
      const ind = document.getElementById('ais-status-indicator');
      if (ind) ind.innerHTML = '(🔴 Desconectado)';
    }

    function updateAisMapSource() {
      if (!map.getSource('ais-ships-src')) return;
      
      const showA = document.getElementById('chk-ais-class-a')?.checked ?? true;
      const showB = document.getElementById('chk-ais-class-b')?.checked ?? true;

      const now = Date.now();
      const features = [];
      
      if (!isAisMasterVisible) {
        map.getSource('ais-ships-src').setData({ type: 'FeatureCollection', features: [] });
        return;
      }
      
      for (const [mmsi, ship] of activeShips.entries()) {
        // Eliminar barcos que no envían reporte en 15 minutos (900000 ms)
        if (now - ship.timestamp > 900000) {
          activeShips.delete(mmsi);
          continue;
        }
        
        if (ship.shipClass === 'A' && !showA) continue;
        if (ship.shipClass === 'B' && !showB) continue;

        features.push({
          type: 'Feature',
          properties: {
            mmsi: ship.mmsi,
            name: ship.name,
            cog: ship.cog,
            sog: ship.sog,
            shipClass: ship.shipClass,
            shipTypeString: ship.shipTypeString,
            destination: ship.destination,
            eta: ship.eta,
            length: ship.length,
            beam: ship.beam
          },
          geometry: {
            type: 'Point',
            coordinates: [ship.lng, ship.lat]
          }
        });
      }
      
      map.getSource('ais-ships-src').setData({
        type: 'FeatureCollection',
        features: features
      });

      const ind = document.getElementById('ais-status-indicator');
      if (ind && isAisMasterVisible) {
        ind.innerHTML = `(🟢 Conectado: ${features.length} buques)`;
      }
    }

    function toggleMasterLandCover(enabled) { saveSessionConfig();
      const v = enabled ? 'visible' : 'none';
      if (map.getLayer('landcover-layer')) map.setLayoutProperty('landcover-layer', 'visibility', v);
      const dd = document.getElementById('dropdown-landcover');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');
    }

    function applyGridFilters() {
      const f500 = document.getElementById('chk-volt-500').checked;
      const f220 = document.getElementById('chk-volt-220').checked;
      const f110 = document.getElementById('chk-volt-110').checked;
      const allowed = [];
      if (f500) allowed.push('500 kV');
      if (f220) allowed.push('220 kV');
      if (f110) { allowed.push('110 kV'); allowed.push('132 kV'); }
      if (map.getLayer('osm-lines')) map.setFilter('osm-lines', ['in', ['get', 'volt'], ['literal', allowed]]);
    }

    function applyGemFilters() {
      const fGas = document.getElementById('chk-gem-gas').checked;
      const fOil = document.getElementById('chk-gem-oil').checked;
      let conds = ['any'];
      if (fGas) conds.push(['in', 'Gas', ['get', 'product']]);
      if (fOil) conds.push(['in', 'Oil', ['get', 'product']]);
      if (!fGas && !fOil) map.setLayoutProperty('gem-lines', 'visibility', 'none');
      else {
        map.setLayoutProperty('gem-lines', 'visibility', 'visible');
        map.setFilter('gem-lines', conds);
      }
    }

    function setLandCoverOpacity(val) { saveSessionConfig();
      const opacity = parseFloat(val) / 100;
      document.getElementById('opacity-val').innerText = val + '%';
      if (map.getLayer('landcover-layer')) map.setPaintProperty('landcover-layer', 'raster-opacity', opacity);
    }

    // =========================================================
    // FILTRADO ESPACIAL DINÁMICO (BBOX) CENTRALES + POZOS
    // =========================================================
    function applySpatialFiltersAll() {
      let bounds = null;
      if (isBboxActive) bounds = map.getBounds();

      const west = bounds ? bounds.getWest() : -180;
      const south = bounds ? bounds.getSouth() : -90;
      const east = bounds ? bounds.getEast() : 180;
      const north = bounds ? bounds.getNorth() : 90;

      // 1. Filtrar Centrales Eléctricas
      if (rawPowerPlants && rawPowerPlants.length > 0) {
        let totalMw = 0;
        const filteredPlants = [];
        for (let i = 0; i < rawPowerPlants.length; i++) {
          const feat = rawPowerPlants[i];
          const fuel = feat.properties.fuel || 'Other';
          if (!activeFuels.has(fuel)) continue;
          if (isBboxActive) {
            const [lon, lat] = feat.geometry.coordinates;
            if (lon < west || lon > east || lat < south || lat > north) continue;
          }
          filteredPlants.push(feat);
          totalMw += (feat.properties.capacity_mw || 0);
        }
        const srcPlants = map.getSource('power-plants');
        if (srcPlants) srcPlants.setData({ type: 'FeatureCollection', features: filteredPlants });
        const countEl = document.getElementById('count-visible');
        if (countEl) countEl.innerText = filteredPlants.length.toLocaleString();
        const mwEl = document.getElementById('mw-visible');
        if (mwEl) mwEl.innerText = Math.round(totalMw).toLocaleString() + ' MW';
      }

      // 2. Filtrar Pozos Petroleros
      if (rawOilWells && rawOilWells.length > 0) {
        const fShale = document.getElementById('chk-oil-shale')?.checked ?? true;
        const fConv = document.getElementById('chk-oil-conv')?.checked ?? true;
        const filteredWells = [];

        for (let i = 0; i < rawOilWells.length; i++) {
          const feat = rawOilWells[i];
          const isShale = feat.properties.tipo === 'No Convencional';
          if (isShale && !fShale) continue;
          if (!isShale && !fConv) continue;

          if (isBboxActive) {
            const [lon, lat] = feat.geometry.coordinates;
            if (lon < west || lon > east || lat < south || lat > north) continue;
          }
          filteredWells.push(feat);
        }

        const srcWells = map.getSource('oil-wells-src');
        if (srcWells) srcWells.setData({ type: 'FeatureCollection', features: filteredWells });
        const counterEl = document.getElementById('wells-count-visible');
        if (counterEl) counterEl.innerText = filteredWells.length.toLocaleString();
      }
    }

    function toggleBboxMode(active) {
      isBboxActive = active;
      applySpatialFiltersAll();
    }

    function toggleFuelFilter(btn) {
      const fuel = btn.getAttribute('data-fuel');
      if (activeFuels.has(fuel)) {
        activeFuels.delete(fuel);
        btn.classList.remove('active');
      } else {
        activeFuels.add(fuel);
        btn.classList.add('active');
      }
      applySpatialFiltersAll();
    }

    function setAllFuels(enable) {
      const allFuelsList = ['Nuclear', 'Hydro', 'Solar', 'Wind', 'Gas', 'Coal', 'Oil', 'Other'];
      document.querySelectorAll('.fuel-btn').forEach(btn => {
        if (enable) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      if (enable) activeFuels = new Set(allFuelsList);
      else activeFuels.clear();
      applySpatialFiltersAll();
    }

    // Switcher Mapa Base
    function setBaseMap(type) {
      if (type === activeBase) return;
      activeBase = type;

      const basemapBtnIds = ['btn-dark', 'btn-satellite', 'btn-light', 'btn-carto_light', 'btn-topo', 'btn-street'];
      document.querySelectorAll('.btn-action').forEach(b => {
        if (basemapBtnIds.includes(b.id)) b.classList.remove('active');
      });
      if (document.getElementById('btn-' + type)) {
        document.getElementById('btn-' + type).classList.add('active');
      }

      const allBasemaps = ['dark', 'satellite', 'light', 'carto_light', 'topo', 'street'];
      allBasemaps.forEach(bm => {
        const layerId = 'basemap-' + bm;
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', bm === type ? 'visible' : 'none');
        }
      });
    }

    // Bookmarks de Ubicación
    function flyToLocation(loc) {
      const locations = {
        arg: { center: [-64.0, -34.5], zoom: 4.8 },
        vacamuerta: { center: [-68.78, -38.35], zoom: 9.2 }, // Añelo / Loma Campana
        golfosanjorge: { center: [-67.50, -45.85], zoom: 8.5 }, // Comodoro Rivadavia
        puna: { center: [-66.85, -24.20], zoom: 7.8 }, // Triángulo del Litio Puna
        cordoba: { center: [-64.18, -31.42], zoom: 12 },
        world: { center: [0, 20], zoom: 2.0 }
      };
      if (locations[loc]) {
        map.flyTo({ ...locations[loc], duration: 1500, essential: true });
      }
    }

    // Configurar Popups Técnicas
    function setupPopups() {
      // Rutas
      // Interacción con Parcelas Catastrales de Formosa (IDEF Identify)
      map.on('click', async (e) => {
        if (isBboxSelecting) return; // Si está dibujando el marco del Copilot, ignorar
        
        // Verificar si la capa de Formosa está activa
        const isFormosaVisible = map.getLayer('cadastre-formosa-layer') && map.getLayoutProperty('cadastre-formosa-layer', 'visibility') === 'visible';
        if (!isFormosaVisible) return;

        // Verificar si las coordenadas corresponden a la Provincia de Formosa
        const { lng, lat } = e.lngLat;
        if (lng < -62.5 || lng > -57.5 || lat < -27.2 || lat > -22.3) return;

        // Convertir coordenadas a Web Mercator (EPSG:3857)
        const x = lng * 20037508.342789244 / 180.0;
        const y = Math.log(Math.tan((90.0 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0) * (20037508.342789244 / 180.0);
        
        // Bounds actuales del mapa en 3857
        const bounds = map.getBounds();
        const minX = bounds.getWest() * 20037508.342789244 / 180.0;
        const maxX = bounds.getEast() * 20037508.342789244 / 180.0;
        const minY = Math.log(Math.tan((90.0 + bounds.getSouth()) * Math.PI / 360.0)) / (Math.PI / 180.0) * (20037508.342789244 / 180.0);
        const maxY = Math.log(Math.tan((90.0 + bounds.getNorth()) * Math.PI / 360.0)) / (Math.PI / 180.0) * (20037508.342789244 / 180.0);
        const mapExtent = `${minX},${minY},${maxX},${maxY}`;
        
        const canvas = map.getCanvas();
        const imageDisplay = `${canvas.width},${canvas.height},96`;

        const identifyUrl = `https://sit.formosa.gob.ar/sit.public/proxy.ashx?https://10.10.0.36/arcgis/rest/services/Formosa/WMS/MapServer/identify?geometry=${x},${y}&geometryType=esriGeometryPoint&sr=3857&layers=all:4,3&tolerance=8&mapExtent=${mapExtent}&imageDisplay=${imageDisplay}&returnGeometry=false&f=pjson`;

        try {
          const resp = await fetch(identifyUrl);
          if (!resp.ok) return;
          const data = await resp.json();
          if (data.results && data.results.length > 0) {
            const res = data.results[0];
            const a = res.attributes || {};
            const isRural = res.layerName === 'ParcelasRurales';
            const partida = a.PARTIDA || a.PAR_PARTIDA || res.value || 'S/D';
            const nomenc = a.NOMENCLATURA || a.PAR_NOMENCLATURA || 'N/D';
            const expte = a.EXPEDIENTE || a.PAR_EXPEDIENTE || 'N/D';
            const anio = a['AÑO'] || a.PAR_ANIO || '';
            const letra = a.LETRA || a.PAR_LET_MENS || '';

            const popupHtml = `
              <div class="popup-title" style="color:#a78bfa;">📑 Parcela Catastral (${isRural ? 'Rural' : 'Urbana'})</div>
              <div class="popup-grid">
                <span>N° Partida Catastral:</span><b style="color:#38bdf8; font-size:13px;">${partida}</b>
                <span>Nomenclatura:</span><span style="font-family:monospace; font-size:10.5px;">${nomenc}</span>
                <span>Expediente / Mensura:</span><span>${expte} ${letra ? '(' + letra + ')' : ''} ${anio ? '· ' + anio : ''}</span>
                <span>Jurisdicción:</span><span>Provincia de Formosa</span>
                <span>Fuente Oficial:</span><span>IDEF / Catastro Territorial</span>
              </div>
              <div style="margin-top:8px; font-size:10px; color:#94a3b8; border-top:1px solid rgba(255,255,255,0.1); padding-top:4px;">
                Identificación oficial del Sistema de Información Territorial (SIT Formosa).
              </div>
            `;

            new maplibregl.Popup({ offset: 10, maxWidth: '320px' })
              .setLngLat(e.lngLat)
              .setHTML(popupHtml)
              .addTo(map);
          }
        } catch (err) {
          console.warn('Error al identificar parcela en Formosa:', err);
        }
      });

      map.on('click', 'roads-vector-line', (e) => {
        const p = e.features[0].properties;
        const html = `
          <div class="popup-title" style="color:#f59e0b;">🛣️ ${p.name || 'Ruta'}</div>
          <div class="popup-grid">
            <span class="popup-lbl">Código / Ref:</span><span class="popup-val" style="color:#ef4444;">${p.ref}</span>
            <span class="popup-lbl">Jurisdicción:</span><span class="popup-val">${p.cat}</span>
            <span class="popup-lbl">Superficie:</span><span class="popup-val">${p.surface}</span>
          </div>
        `;
        new maplibregl.Popup({ offset: 6 }).setLngLat(e.lngLat).setHTML(html).addTo(map);
      });

      // Centrales
      map.on('click', 'plants-layer', (e) => {
        const p = e.features[0].properties;
        const coords = e.features[0].geometry.coordinates.slice();
        const html = `
          <div class="popup-title">⚡ ${p.name || 'Central Eléctrica'}</div>
          <div class="popup-grid">
            <span class="popup-lbl">País:</span><span class="popup-val">${p.country || 'N/A'}</span>
            <span class="popup-lbl">Combustible:</span><span class="popup-val" style="color:#38bdf8;">${p.fuel}</span>
            <span class="popup-lbl">Potencia:</span><span class="popup-val">${Number(p.capacity_mw).toLocaleString()} MW</span>
            <span class="popup-lbl">Gen. Histórica:</span><span class="popup-val">${Number(p.gen_gwh).toLocaleString()} GWh</span>
          </div>
        `;
        new maplibregl.Popup({ offset: 8 }).setLngLat(coords).setHTML(html).addTo(map);
      });

      // Ductos GEM
      map.on('click', 'gem-lines', (e) => {
        const p = e.features[0].properties;
        const html = `
          <div class="popup-title" style="color:#00e5ff;">━ ${p.name || 'Ducto Troncal'}</div>
          <div class="popup-grid">
            <span class="popup-lbl">Producto:</span><span class="popup-val">${p.product || 'Hidrocarburos'}</span>
            <span class="popup-lbl">Longitud:</span><span class="popup-val">${p.length_km ? p.length_km + ' km' : 'N/A'}</span>
          </div>
        `;
        new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
      });

      // AIS Ships - Send to Inspector Drawer
      map.on('click', 'ais-ships-layer', (e) => {
        const p = e.features[0].properties;
        const color = p.shipClass === 'A' ? '#60a5fa' : '#34d399';
        
        const contentHtml = `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; margin-bottom:16px;">
            <div style="font-size:18px; font-weight:700; color:${color};">🚢 ${p.name || 'Buque Comercial'}</div>
            <div style="font-size:12px; color:#94a3b8;">MMSI: <span style="color:#e2e8f0;">${p.mmsi}</span></div>
          </div>
          
          <div class="inspector-grid">
            <div class="inspector-card">
              <div class="inspector-card-title">Clasificación AIS</div>
              <div class="inspector-card-value">Clase ${p.shipClass}</div>
            </div>
            <div class="inspector-card">
              <div class="inspector-card-title">Tipo de Buque</div>
              <div class="inspector-card-value" style="color:#f59e0b;">${p.shipTypeString || 'N/D'}</div>
            </div>
            <div class="inspector-card">
              <div class="inspector-card-title">Velocidad Actual (SOG)</div>
              <div class="inspector-card-value">${Number(p.sog).toFixed(1)} nudos</div>
            </div>
            <div class="inspector-card">
              <div class="inspector-card-title">Rumbo (COG)</div>
              <div class="inspector-card-value">${Number(p.cog).toFixed(1)}°</div>
            </div>
            <div class="inspector-card">
              <div class="inspector-card-title">Dimensiones</div>
              <div class="inspector-card-value">${p.length && p.length > 0 ? p.length + 'm x ' + p.beam + 'm' : 'Esperando...'}</div>
            </div>
            <div class="inspector-card" style="grid-column: span 2;">
              <div class="inspector-card-title">Destino Declarado</div>
              <div class="inspector-card-value" style="color:#38bdf8; font-size:16px;">${p.destination || 'Esperando...'}</div>
            </div>
          </div>
        `;
        document.getElementById('inspector-content').innerHTML = contentHtml;
        openBottomDrawer('inspector');
      });

      ['plants-layer', 'gem-lines', 'osm-lines', 'roads-vector-line', 'oil-wells-layer', 'mining-projects-layer', 'puertos-fluviales-layer', 'hidrovia-lines', 'cuencas-hidro-fill', 'cuerpos-agua-fill', 'flood-history-fill', 'ais-ships-layer'].forEach(layer => {
        map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = ''; });
      });
    }

    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('collapsed');
    }

    // =========================================================
    // CENTRO DE AUDITORÍA Y SALUD DE FUENTES
    // =========================================================
    let activeFilter = 'all';
    let searchQuery = '';

    function openHealthModal() {
      document.getElementById('health-modal-overlay').classList.add('active');
      renderSourcesTable();
      if (!sourceHealthState['oil-wells'].latency) {
        runFullSourcesAudit();
      }
    }

    function closeHealthModal() {
      document.getElementById('health-modal-overlay').classList.remove('active');
    }

    function handleModalOverlayClick(e) {
      if (e.target.id === 'health-modal-overlay') closeHealthModal();
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeHealthModal();
    });

    function filterSourcesTable(category, btn) {
      activeFilter = category;
      document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      renderSourcesTable();
    }

    function searchSourcesTable(val) {
      searchQuery = (val || '').toLowerCase().trim();
      renderSourcesTable();
    }

    function renderSourcesTable() {
      const tbody = document.getElementById('sources-table-body');
      if (!tbody) return;

      const filtered = DATA_SOURCES.filter(s => {
        const matchesCategory = (activeFilter === 'all') || (s.category === activeFilter);
        const matchesSearch = !searchQuery || 
          s.name.toLowerCase().includes(searchQuery) || 
          s.provider.toLowerCase().includes(searchQuery) ||
          s.protocol.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
      });

      let html = '';
      filtered.forEach(s => {
        const state = sourceHealthState[s.id] || { status: 'pending', latency: null, httpCode: null };
        let badgeHtml = '';

        if (state.status === 'checking') {
          badgeHtml = `<span class="status-badge checking"><span class="loading-spinner" style="width:10px;height:10px;border-width:1.5px;"></span> PING...</span>`;
        } else if (state.status === 'online') {
          badgeHtml = `<span class="status-badge online">● ${state.latency} ms (${state.httpCode || 200})</span>`;
        } else if (state.status === 'slow') {
          badgeHtml = `<span class="status-badge slow">▲ ${state.latency} ms (Lento)</span>`;
        } else if (state.status === 'error') {
          badgeHtml = `<span class="status-badge error">✕ ERROR (${state.httpCode || 'FAIL'})</span>`;
        } else {
          badgeHtml = `<span class="status-badge" style="background:rgba(255,255,255,0.05); color:#94a3b8;">○ PENDIENTE</span>`;
        }

        html += `
          <tr id="row-${s.id}">
            <td>
              <div class="source-name-cell">
                <div class="source-name-title"><span>${s.name}</span></div>
                <div><span class="source-scope-tag">${s.scope}</span></div>
              </div>
            </td>
            <td>
              <a href="${s.providerUrl}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; text-decoration:none;" class="ref-link">
                ${s.provider} ↗
              </a>
            </td>
            <td><span style="font-family:'JetBrains Mono', monospace; font-size:10.5px; color:#cbd5e1;">${s.protocol}</span></td>
            <td>
              <div style="color:#f1f5f9; font-weight:500;">${s.lastUpdate}</div>
              <div style="font-size:9.5px; color:var(--text-muted); font-family:'JetBrains Mono', monospace;">Frec: ${s.frequency}</div>
            </td>
            <td id="badge-container-${s.id}">${badgeHtml}</td>
            <td style="text-align:center;">
              <button class="btn-mini-test" onclick="pingSingleSource('${s.id}')" title="Testear latencia y estado">Ping</button>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }

    async function pingSourceEngine(source) {
      const t0 = performance.now();
      const cacheBust = (source.testUrl.includes('?') ? '&' : '?') + '_lusat_t=' + Date.now();
      const url = source.testUrl + cacheBust;

      if (source.pingType === 'image') {
        return new Promise((resolve) => {
          const img = new Image();
          const timer = setTimeout(() => {
            resolve({ success: false, latency: Math.round(performance.now() - t0), code: 'TIMEOUT' });
          }, 8000);
          img.onload = () => {
            clearTimeout(timer);
            resolve({ success: true, latency: Math.round(performance.now() - t0), code: '200 OK' });
          };
          img.onerror = () => {
            clearTimeout(timer);
            const ms = Math.round(performance.now() - t0);
            resolve({ success: ms < 5000, latency: ms, code: ms < 5000 ? '200 (IMG)' : 'ERR' });
          };
          img.src = url;
        });
      } else {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 8000);
          const resp = await fetch(url, { method: 'GET', signal: controller.signal, mode: 'cors' });
          clearTimeout(timer);
          const ms = Math.round(performance.now() - t0);
          return { success: resp.ok || resp.status < 400, latency: ms, code: resp.status + ' OK' };
        } catch (e) {
          return new Promise((resolve) => {
            const img = new Image();
            const timer = setTimeout(() => resolve({ success: false, latency: Math.round(performance.now() - t0), code: 'TIMEOUT' }), 5000);
            img.onload = () => { clearTimeout(timer); resolve({ success: true, latency: Math.round(performance.now() - t0), code: '200 OK' }); };
            img.onerror = () => {
              clearTimeout(timer);
              const ms = Math.round(performance.now() - t0);
              resolve({ success: ms < 4000, latency: ms, code: ms < 4000 ? '200' : 'CORS/ERR' });
            };
            img.src = url;
          });
        }
      }
    }

    async function pingSingleSource(id) {
      const source = DATA_SOURCES.find(s => s.id === id);
      if (!source) return;
      sourceHealthState[id].status = 'checking';
      updateRowBadge(id);

      const res = await pingSourceEngine(source);
      sourceHealthState[id].latency = res.latency;
      sourceHealthState[id].httpCode = res.code;
      sourceHealthState[id].lastTested = new Date();
      sourceHealthState[id].status = !res.success ? 'error' : (res.latency > 800 ? 'slow' : 'online');
      updateRowBadge(id);
      updateKpis();
    }

    function updateRowBadge(id) {
      const container = document.getElementById('badge-container-' + id);
      if (!container) return;
      const state = sourceHealthState[id];
      if (state.status === 'checking') container.innerHTML = `<span class="status-badge checking"><span class="loading-spinner" style="width:10px;height:10px;border-width:1.5px;"></span> PING...</span>`;
      else if (state.status === 'online') container.innerHTML = `<span class="status-badge online">● ${state.latency} ms (${state.httpCode})</span>`;
      else if (state.status === 'slow') container.innerHTML = `<span class="status-badge slow">▲ ${state.latency} ms (Lento)</span>`;
      else if (state.status === 'error') container.innerHTML = `<span class="status-badge error">✕ ERROR (${state.httpCode})</span>`;
    }

    async function runFullSourcesAudit() {
      const btn = document.getElementById('btn-run-audit');
      btn.classList.add('testing');
      btn.innerHTML = `<span class="loading-spinner" style="width:12px;height:12px;border-width:1.5px;"></span> Auditando 16 fuentes...`;

      DATA_SOURCES.forEach(s => {
        sourceHealthState[s.id].status = 'checking';
        updateRowBadge(s.id);
      });

      const promises = DATA_SOURCES.map(async (source) => {
        const res = await pingSourceEngine(source);
        sourceHealthState[source.id].latency = res.latency;
        sourceHealthState[source.id].httpCode = res.code;
        sourceHealthState[source.id].lastTested = new Date();
        sourceHealthState[source.id].status = !res.success ? 'error' : (res.latency > 800 ? 'slow' : 'online');
        updateRowBadge(source.id);
      });

      await Promise.allSettled(promises);
      btn.classList.remove('testing');
      btn.innerHTML = `<span>⚡ Re-auditar las 16 Fuentes</span>`;
      updateKpis();
    }

    function updateKpis() {
      let total = DATA_SOURCES.length;
      let okCount = 0, totalLatency = 0, testedCount = 0;

      DATA_SOURCES.forEach(s => {
        const st = sourceHealthState[s.id];
        if (st.latency !== null) {
          testedCount++;
          totalLatency += st.latency;
          if (st.status === 'online' || st.status === 'slow') okCount++;
        }
      });

      document.getElementById('kpi-total-sources').innerText = `${okCount} / ${total} Activas`;
      const availPct = testedCount > 0 ? Math.round((okCount / testedCount) * 100) : 100;
      const availEl = document.getElementById('kpi-global-avail');
      availEl.innerText = `${availPct}% OPERACIONAL`;
      availEl.style.color = availPct >= 90 ? '#10b981' : (availPct >= 60 ? '#f59e0b' : '#ef4444');

      if (testedCount > 0) {
        document.getElementById('kpi-avg-latency').innerText = `${Math.round(totalLatency / testedCount)} ms`;
      }
      const now = new Date();
      document.getElementById('kpi-last-check').innerText = `Hoy ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
