# LUSAT v7 — GEOINTELIGENCIA, HIDROGRAFÍA OFICIAL IGN/INA, INFRAESTRUCTURA, ENERGÍA & MINERÍA (60 FPS)

Bienvenido a **LUSAT v7**, la plataforma de inteligencia territorial y geoanálisis estratégico de alto rendimiento impulsada por **WebGL (MapLibre GL JS)**, filtrado espacial dinámico sin clustering destructivo, federación catastral provincial WMS, altimetría cuantitativa 3D con curvas de nivel en metros, cartografía hidrográfica oficial del **Instituto Geográfico Nacional (IGN)**, sistemas oficiales de simulación de crecidas y alertas del **Instituto Nacional del Agua (INA)** y monitoreo de salud de **23 fuentes de datos en tiempo real**.

---

## 1. CAPAS Y MÓDULOS ACTIVOS

### 🌊 Hidrografía Oficial de la República Argentina & Crecidas (IGN / INA)
* **Cartografía Fluvial Oficial IGN (WMS Oficial):**
  * Red fluvial lineal oficial completa (`lineas_de_aguas_continentales_perenne`, `intermitentes`, `BH020` canales y `BH030` acequias/zanjas) con opacidad regulable.
  * Cuerpos de agua poligonales oficiales (`areas_de_aguas_continentales_perenne`, `intermitente`, `BH140` cursos fluviales mayores, `BH130` embalses y `041101` embalses rurales).
* **Vías Navegables & Balizamiento Oficial (OpenSeaMap):**
  * Boyas náuticas, balizas luminosas de enfilación y canales de navegación comercial de la Hidrovía Paraná-Paraguay y Río de la Plata.
* **Simulaciones Oficiales de Crecidas y Alturas Hidrométricas (INA SIyAH):**
  * `siyah:alturas_sim_view`: Capa oficial del Instituto Nacional del Agua con simulaciones hidrodinámicas de alturas ante crecidas en la Cuenca del Plata.
  * `siyah:estaciones_view`: Red telemétrica oficial de aforo con niveles de ríos en tiempo real, cotas de alerta y evacuación.
  * Enlace directo al portal operativo del INA: [https://alerta.ina.gob.ar/](https://alerta.ina.gob.ar/).

### ⛰️ Altimetría Cuantitativa, Curvas de Nivel & Relieve 3D Físico
* **Altímetro Digital en Vivo (msnm):** Medición continua bajo el cursor por GPU (0 ms latencia).
* **Curvas de Nivel con Cotas Numéricas (OpenTopoMap / SRTM):** Cotas en metros (20m/50m/100m) y picos montañosos con alturas oficiales.
* **Malla 3D Físico (AWS Terrarium DEM):** Relieve WebGL con exageración vertical regulable (1.0x a 2.5x).
* **Botones de Cámara:** `[ 🏔️ 3D ]` (inclinación a 58°) y `[ 🧭 Cenital 2D ]`.

### 🛢️ Pozos & Cuencas Hidrocarburíferas de Argentina (Secretaría de Energía)
* **84.239 Pozos Oficiales (Capítulo IV Ley 17.319):** No Convencional (Vaca Muerta / Shale en magenta neón) y Convencional (naranja ámbar).
* **24 Cuencas Sedimentarias Oficiales:** Delimitación geológica de cuencas productivas y exploratorias.

### ⛏️ Yacimientos Mineros & Salares de Litio (SIACAM / SEGEMAR / Global)
* **101 Proyectos Mineros Estratégicos:** Litio, Cobre, Oro, Plata, Uranio y Potasio con fichas técnicas.

### 📑 Catastro & Parcelas Rurales (Federación Provincial WMS)
* **Formosa (IDEF SIT), Córdoba (IDECOR) y Santa Fe (SCIT / IDESF)** integrados vía OGC WMS oficial.

### 🛣️ Red Vial Completa (Nac / Prov / Municipal / Rural)
* Rutas nacionales y provinciales vectoriales, malla urbana municipal y huellas rurales dinámicas bajo demanda vía Overpass API.

### ⚡ Energía e Infraestructura Troncal
* **34.936 Centrales Eléctricas (WRI), Red de Alta Tensión (HIFLD USA + Mercosur OSM), Ductos Críticos (GEM) y Cobertura de Suelo Sentinel-2 (10m)**.

---

## 2. 🍪 PERSISTENCIA DE SESIÓN, COOKIES & POLÍTICA TÉCNICA
* **Inicio Limpio (Todas las Capas Apagadas):** LUSAT v7 arranca por defecto con todas las capas apagadas (0% saturación, visibilidad `none`), garantizando carga ultra veloz y máxima fluidez inicial.
* **Mapa Base Satelital por Defecto:** Al iniciar por primera vez o sin sesión guardada, LUSAT carga directamente sobre la imagen satelital global de alta resolución (*ArcGIS World Imagery*).
* **Persistencia de Sesión:** Si el usuario acepta las cookies en el banner inferior, el visor almacena y recuerda automáticamente el estado de cada interruptor de capa, sliders de opacidad, mapa base seleccionado y coordenadas de cámara para su próxima sesión.
* **Política de Cookies Escrita:** Modal accesible desde el banner o el icono `🍪` del panel lateral, declarando expresamente una finalidad técnica (0 rastreo, 0 publicidad, 0 terceros) con botón de revocación y borrado inmediato.
* **Motor WMS Dinámico en MapLibre:** Interceptor `transformRequest` en tiempo real con conversor matemático de coordenadas tesela a BBOX métrico EPSG:3857, habilitando la renderización fluida de los servidores WMS de IGN e INA.

---

## 3. 🤖 LUSAT GEO-COPILOT (GEMINI SPATIAL AI & SELECCIÓN TERRITORIAL)
* **Selector Espacial en Vivo (BBOX):** Herramienta interactiva para dibujar rectángulos en el mapa (`[ ⛶ Seleccionar Área ]`) o interrogar la vista actual completa (`[ 🗺️ Analizar Vista Actual ]`).
* **Spatial RAG en Memoria (0 ms):** Extracción instantánea de pozos petroleros (convencionales vs Vaca Muerta, operadoras líderes), centrales eléctricas (MW y combustibles), proyectos mineros (litio, cobre, oro), altimetría y vías de transporte dentro del polígono delimitado.
* **Inteligencia Multimodal con Google Gemini:** Integración directa con `gemini-1.5-flash` y `gemini-2.0-flash` vía Google AI Studio (cuota gratuita de 1.500 consultas diarias). Soporta visión multimodal adjuntando la captura visual del mapa satelital a la consulta.
* **Dock Flotante de Chat:** Preguntas libres o sugerencias con un clic (*Resumen Ejecutivo, Análisis de Pozos, Red Eléctrica, Riesgo Hídrico, Minería y Litio*). Almacenamiento local seguro de la API Key en el navegador (`localStorage`).

---

## 4. 🩺 CENTRO DE AUDITORÍA Y SALUD DE FUENTES (23 SERVIDORES)

Monitoreo accesible desde el botón superior **[ 🩺 SALUD DE FUENTES (23) ]**:
* Pings de latencia en milisegundos y códigos de estado HTTP en vivo para las **23 fuentes integradas**.
* Filtros por categoría: *Hidrografía Oficial & INA (5), Hidrocarburos & Minería (4), Catastro & Parcelas (3), Energía & Ductos (3), Relieve & Suelo (5), Mapas Base & Vial (3)*.
* Re-auditoría masiva o individual en tiempo real.

---

## 5. INICIO RÁPIDO

Ejecuta en tu terminal o haz doble clic sobre:
```text
iniciar_lusat.bat
```
Visor activo en **http://localhost:8085**.

