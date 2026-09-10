# Reporte técnico — Industria basal argentina (georreferenciación)

*Generado el 2026-09-10 por `scripts/industria/build_industria.py`.*

Fuente primaria: `scripts/industria/Geografia_Industrial_Argentina.md`. Registro curado: `scripts/industria/registros.py`.

## 1. Resumen

| Métrica | Valor |
|---|---|
| Registros curados | 150 |
| Nodos georreferenciados (features) | 147 |
| Sin georreferenciar | 3 |
| Precisión EXACTA | 80 |
| Precisión ESTIMADA | 67 |
| Consultas a Nominatim en esta corrida | 1 |
| Aciertos de caché | 204 |

### Por categoría

| Categoría | Código | Nodos |
|---|---|---|
| Cemento, Cal y Yeso | CEM | 37 |
| Siderurgia, Metalurgia y Perfilería | SID | 18 |
| Áridos, Cerámica Roja y Pisos | ARI | 5 |
| Vidrio y Aislaciones | VID | 11 |
| Infraestructura Hídrica y Polímeros de Conducción | HID | 7 |
| Maquinaria Pesada, Agrícola, Vial y Carrocerías | MAQ | 18 |
| Molinería y Alimentos Básicos a Granel | MOL | 45 |
| Nodos Energéticos y Material Eléctrico Pesado | ENE | 6 |

### Por estado operativo

| Estado | Nodos |
|---|---|
| ACTIVA | 138 |
| CERRADA | 3 |
| EN_QUIEBRA/SUBASTA | 6 |

### Por tipo de nodo

| Tipo | Nodos |
|---|---|
| CENTRAL_ENERGETICA | 3 |
| PLANTA | 137 |
| POLO_REGIONAL | 6 |
| PUERTO | 1 |

## 2. Inventario georreferenciado

| ID | Empresa | Planta | Localidad | Provincia | Lat | Lon | Precisión | Método |
|---|---|---|---|---|---|---|---|---|
| IND-CEM-001 | Loma Negra CIASA (Grupo InterCement) | L'Amalí (I y II) | Olavarría | Buenos Aires | -37.03967 | -60.29551 | EXACTA | Nominatim/OSM: Fábrica L'Amalí, Partido de Olavarría, Buenos Aires, Argentina (landuse/industrial) |
| IND-CEM-002 | Loma Negra CIASA (Grupo InterCement) | Planta Barker | Barker | Buenos Aires | -37.68310 | -59.38790 | EXACTA | Nominatim/OSM: Fábrica Barker - Loma Negra, Villa Cacique, Partido de Benito Juárez, Buenos Aires, 7005, Argentina (landuse/industrial) |
| IND-CEM-003 | Loma Negra CIASA (Grupo InterCement) | Planta Ramallo (molienda con escoria "Ecocemento") | Ramallo | Buenos Aires | -33.38286 | -60.15975 | EXACTA | Nominatim/OSM: Comirsa 1, Partido de Ramallo, Buenos Aires, Argentina (landuse/industrial) |
| IND-CEM-004 | Loma Negra CIASA (Grupo InterCement) | Planta Zapala | Zapala | Neuquén | -38.89691 | -70.03522 | EXACTA | Nominatim/OSM: Loma Negra, S/N, Michacheo, Zapala, Municipio de Zapala, Departamento Zapala, Neuquén, Q8340, Argentina (landuse/industrial) |
| IND-CEM-005 | Loma Negra CIASA (Grupo InterCement) | Planta Catamarca | El Alto | Catamarca | -28.46753 | -65.22795 | EXACTA | Nominatim/OSM: Loma Negra, Municipio de Tapso, Departamento El Alto, Catamarca, K4235, Argentina (landuse/industrial) |
| IND-CEM-006 | Loma Negra CIASA (Grupo InterCement) | Planta San Juan | Rivadavia | San Juan | -31.54888 | -68.67502 | EXACTA | Nominatim/OSM: Loma Negra, 16000 (O), Comuna La Bebida, Rivadavia, San Juan, 5478, Argentina (landuse/industrial) |
| IND-CEM-007 | Loma Negra CIASA (Grupo InterCement) | Planta Sierras Bayas | Sierras Bayas | Buenos Aires | -36.93665 | -60.15611 | EXACTA | Nominatim/OSM: Sierras Bayas, Partido de Olavarría, Buenos Aires, Argentina (boundary/administrative) |
| IND-CEM-008 | Holcim Argentina | Malagueño (Centro Industrial Córdoba) | Malagueño | Córdoba | -31.47837 | -64.36239 | EXACTA | Nominatim/OSM: Acceso a Fábrica Holcim, Camino Blanco, Malagueño, Municipio de Malagueño, Pedanía Calera, Departamento Santa María, Córdoba, X5186, Argentina (highway/residential) |
| IND-CEM-009 | Holcim Argentina | Planta Campana | Campana | Buenos Aires | -34.14978 | -59.01284 | EXACTA | Nominatim/OSM: Holcim Argentina, Campana, Partido de Zárate, Buenos Aires, B2804NPA, Argentina (landuse/industrial) |
| IND-CEM-010 | Holcim Argentina | Planta Puesto Viejo | Puesto Viejo | Jujuy | -24.49039 | -64.95658 | EXACTA | Nominatim/OSM: Planta de producción de cemento Holcim, Municipio de Puesto Viejo, Departamento El Carmen, Jujuy, Argentina (landuse/industrial) |
| IND-CEM-011 | Holcim Argentina | Planta Capdeville | Capdeville | Mendoza | -32.73992 | -68.84349 | EXACTA | Nominatim/OSM: Holcim - Planta Capdeville, Distrito Capdevilla, Departamento Las Heras, Mendoza, Argentina (landuse/industrial) |
| IND-CEM-012 | Holcim Argentina | Ex planta Yocsina | Yocsina | Córdoba | -31.44588 | -64.36473 | EXACTA | Nominatim/OSM: Yocsina, Municipio de Malagueño, Pedanía Calera, Departamento Santa María, Córdoba, X5186, Argentina (place/village) |
| IND-CEM-013 | Cementos Avellaneda S.A. (Cementos Molins / Votorantim) | Planta Olavarría (San Jacinto) | Olavarría | Buenos Aires | -36.96617 | -60.25825 | EXACTA | Nominatim/OSM: San Jacinto, Olavarría, Partido de Olavarría, Buenos Aires, 7403, Argentina (place/isolated_dwelling) |
| IND-CEM-014 | Cementos Avellaneda S.A. (Cementos Molins / Votorantim) | Planta San Luis (La Calera) | La Calera | San Luis | -32.87729 | -66.84247 | EXACTA | Nominatim/OSM: La Calera, Comisión Municipal de La Calera, Belgrano, San Luis, Argentina (place/village) |
| IND-CEM-015 | Cementos Avellaneda S.A. (Cementos Molins / Votorantim) | Planta hormigones San Justo | Villa Luzuriaga | Buenos Aires | -34.67320 | -58.60250 | EXACTA | Nominatim/OSM: 435, Chenaut, María Mazzarello, Villa Luzuriaga, Partido de La Matanza, Buenos Aires, 1753, Argentina (place/house) |
| IND-CEM-016 | Cementos Avellaneda S.A. (Cementos Molins / Votorantim) | Planta hormigones Laferrere | Isidro Casanova | Buenos Aires | -34.73806 | -58.56933 | EXACTA | Nominatim/OSM: Monseñor López May, Primero de Mayo, Isidro Casanova, Partido de La Matanza, Buenos Aires, 1757, Argentina (highway/residential) |
| IND-CEM-017 | Cementos Avellaneda S.A. (Cementos Molins / Votorantim) | Planta hormigones José León Suárez | José León Suárez | Buenos Aires | -34.51000 | -58.59009 | EXACTA | Nominatim/OSM: Camino Parque del Buen Ayre, Barrio Nuevo, Villa José León Suárez, Partido de General San Martín, Buenos Aires, B1655, Argentina (highway/motorway) |
| IND-CEM-018 | Cementos Avellaneda S.A. (Cementos Molins / Votorantim) | Planta hormigones Campana | Campana | Buenos Aires | -34.16366 | -58.95868 | ESTIMADA | Nominatim/OSM: Campana, Partido de Campana, Buenos Aires, 2804, Argentina (place/town) |
| IND-CEM-019 | PCR S.A. (Petroquímica Comodoro Rivadavia) | Planta Pico Truncado | Pico Truncado | Santa Cruz | -46.79010 | -67.92827 | EXACTA | Nominatim/OSM: Planta de Cemento PCR Santa Cruz, Industrial, Pico Truncado, Deseado, Santa Cruz, Argentina (landuse/industrial) |
| IND-CEM-020 | PCR S.A. (Petroquímica Comodoro Rivadavia) | Planta Comodoro Rivadavia | Comodoro Rivadavia | Chubut | -45.80075 | -67.42257 | EXACTA | Nominatim/OSM: Estacionamiento PCR, Avenida Alejandro Maiz, Los Locos, Km. 8 - Don Bosco, Municipio de Comodoro Rivadavia, Departamento Escalante, Chubut, U9000, Argentina (amenity/parking) |
| IND-CEM-021 | Caleras San Juan S.A. | Planta Cienaguita (4 hornos MAERZ) | Cienaguita | San Juan | -32.07257 | -68.69186 | EXACTA | Nominatim/OSM: La Cienaguita, Sarmiento, San Juan, Argentina (place/village) |
| IND-CEM-022 | Sibelco Argentina (grupo belga, ex Minera TEA) | Planta Albardón (La Laja) — "Minera Tea" | La Laja | San Juan | -31.34267 | -68.49262 | EXACTA | Nominatim/OSM: La Laja, Villa Ampacama, Albardón, San Juan, Argentina (natural/bare_rock) |
| IND-CEM-023 | Sibelco Argentina (grupo belga) | Planta Los Berros (ex La Buena Esperanza) | Los Berros | San Juan | -31.95270 | -68.65427 | EXACTA | Nominatim/OSM: Los Berros, Sarmiento, San Juan, 5431, Argentina (place/village) |
| IND-CEM-024 | Sibelco Argentina (grupo belga) | Planta El Villicum (ex El Volcán) | El Villicum | San Juan | -31.21758 | -68.43702 | ESTIMADA | Nominatim/OSM: Albardón, San Juan, J5419, Argentina (boundary/administrative) |
| IND-CEM-025 | Grupo Calidra / CEFAS (mexicano) | Planta Los Berros (marca "El Milagro") | Los Berros | San Juan | -31.95270 | -68.65427 | EXACTA | Nominatim/OSM: Los Berros, Sarmiento, San Juan, 5431, Argentina (place/village) |
| IND-CEM-026 | Compañía Minera del Pacífico S.A. (Cementos Bío Bío + Soprocal) | Planta Jáchal (ex "El Refugio") | San José de Jáchal | San Juan | -30.24160 | -68.74659 | ESTIMADA | Nominatim/OSM: San José de Jáchal, Jáchal, San Juan, Argentina (boundary/administrative) |
| IND-CEM-027 | Grupo Calidra / CEFAS (mexicano) | Planta Quilpo | Cruz del Eje | Córdoba | -30.86270 | -64.68434 | EXACTA | Nominatim/OSM: Quilpo, Pedanía San Marcos, Departamento Cruz del Eje, Córdoba, X5280, Argentina (highway/unclassified) |
| IND-CEM-028 | Grupo Calidra / CEFAS (mexicano) | Planta Malagueño ("Cal Malagueño") | Malagueño | Córdoba | -31.46239 | -64.35433 | EXACTA | Nominatim/OSM: Malagueño, Municipio de Malagueño, Pedanía Calera, Departamento Santa María, Córdoba, X5186, Argentina (place/town) |
| IND-CEM-029 | Grupo Calidra / CEFAS (mexicano) | Planta Olavarría | Olavarría | Buenos Aires | -36.89388 | -60.32317 | ESTIMADA | Nominatim/OSM: Olavarría, Partido de Olavarría, Buenos Aires, B7400, Argentina (place/city) |
| IND-CEM-030 | Grupo Calidra / CEFAS (mexicano) | Planta Zapala | Zapala | Neuquén | -38.90062 | -70.06686 | ESTIMADA | Nominatim/OSM: Municipio de Zapala, Departamento Zapala, Neuquén, Q8340, Argentina (boundary/administrative) |
| IND-CEM-031 | Knauf Argentina | Planta Luján de Cuyo | Luján de Cuyo | Mendoza | -33.03914 | -68.87999 | ESTIMADA | Nominatim/OSM: Distrito Ciudad de Luján de Cuyo, Departamento Luján de Cuyo, Mendoza, Argentina (boundary/administrative) |
| IND-CEM-032 | Saint-Gobain Placo | Planta Chimbas | Chimbas | San Juan | -31.48468 | -68.50938 | ESTIMADA | Nominatim/OSM: Chimbas, San Juan, 5413, Argentina (boundary/administrative) |
| IND-CEM-033 | Durlock S.A. (Grupo Etex, belga) | Complejo industrial General Acha | General Acha | La Pampa | -37.37819 | -64.60430 | ESTIMADA | Nominatim/OSM: General Acha, Municipio de General Acha, Departamento Utracán, La Pampa, Argentina (boundary/administrative) |
| IND-CEM-034 | Durlock S.A. (Grupo Etex, belga) | Plantas Malargüe (2 plantas) | Malargüe | Mendoza | -35.46838 | -69.58473 | ESTIMADA | Nominatim/OSM: Malargüe, Distrito Ciudad de Malargüe, Departamento Malargüe, Mendoza, Argentina (boundary/administrative) |
| IND-CEM-035 | Durlock S.A. (ex "Cía. Corral", adquirida 2008) | Planta General Roca — yesera histórica (barrio Stefenelli) | General Roca | Río Negro | -39.04801 | -67.54277 | EXACTA | Nominatim/OSM: Padre Stefenelli, Municipio de General Roca, Departamento General Roca, Río Negro, 8232, Argentina (boundary/administrative) |
| IND-CEM-036 | Durlock S.A. (Grupo Etex, belga) | Nueva planta Parque Industrial Roca II | General Roca | Río Negro | -39.01762 | -67.53743 | EXACTA | Nominatim/OSM: Parque Industrial, General Roca, Municipio de General Roca, Departamento General Roca, Río Negro, Argentina (boundary/administrative) |
| IND-CEM-037 | Durlock S.A. / Grupo Etex | Planta San Justo (fibrocemento) | San Justo | Buenos Aires | -34.67742 | -58.56078 | ESTIMADA | Nominatim/OSM: San Justo, Partido de La Matanza, Buenos Aires, Argentina (boundary/administrative) |
| IND-SID-001 | Ternium Argentina (ex Siderar/Somisa) | Planta Savio / San Nicolás | San Nicolás de los Arroyos | Buenos Aires | -33.37908 | -60.17814 | EXACTA | Nominatim/OSM: Somisa, San Nicolás de los Arroyos, Partido de San Nicolás, Buenos Aires, Argentina (boundary/administrative) |
| IND-SID-002 | Ternium Argentina (ex Siderar/Somisa) | Planta Haedo | Haedo | Buenos Aires | -34.63874 | -58.61029 | EXACTA | Nominatim/OSM: Ternium, Valentín Gómez, Haedo, Partido de Morón, Buenos Aires, B1706CGO, Argentina (man_made/works) |
| IND-SID-003 | Ternium Argentina (ex Siderar/Somisa) | Planta Canning | Canning | Buenos Aires | -34.87746 | -58.51160 | EXACTA | Nominatim/OSM: Ternium Siderar Planta Canning, Canning, Partido de Ezeiza, Buenos Aires, Argentina (landuse/industrial) |
| IND-SID-004 | Ternium Argentina (ex Siderar/Somisa) | Planta Ensenada | Ensenada | Buenos Aires | -34.85741 | -57.94096 | EXACTA | Nominatim/OSM: Ternium Siderar Ensenada, Ensenada, Partido de Ensenada, Buenos Aires, B1925, Argentina (landuse/industrial) |
| IND-SID-005 | Ternium Argentina (ex Siderar/Somisa) | Planta Florencio Varela | Florencio Varela | Buenos Aires | -34.80444 | -58.27832 | ESTIMADA | Nominatim/OSM: San Juan Bautista, Partido de Florencio Varela, Buenos Aires, Argentina (boundary/administrative) |
| IND-SID-006 | Acindar (ArcelorMittal) | Planta Villa Constitución | Villa Constitución | Santa Fe | -33.25717 | -60.28519 | EXACTA | Nominatim/OSM: Acindar Villa Constitucion, Villa Constitución, Municipio de Villa Constitución, Departamento Constitución, Santa Fe, Argentina (landuse/industrial) |
| IND-SID-007 | Acindar (ArcelorMittal) | Planta San Nicolás | San Nicolás de los Arroyos | Buenos Aires | -33.34673 | -60.25717 | EXACTA | Nominatim/OSM: Acindar San Nicolás (Perfiles Livianos), Lares, San Nicolás de los Arroyos, Partido de San Nicolás, Buenos Aires, Argentina (landuse/industrial) |
| IND-SID-008 | Acindar (ArcelorMittal) | Planta La Tablada | La Tablada | Buenos Aires | -34.69264 | -58.54190 | EXACTA | Nominatim/OSM: Acindar, Doctor Ignacio Arieta, Villa Giardino, La Tablada, Partido de La Matanza, Buenos Aires, 1751, Argentina (highway/bus_stop) |
| IND-SID-009 | Tenaris Siderca | Planta Campana | Campana | Buenos Aires | -34.15221 | -58.97653 | EXACTA | Nominatim/OSM: Tenaris Siderca, 250, Campana, Partido de Campana, Buenos Aires, B2804MHA, Argentina (landuse/industrial) |
| IND-SID-010 | Tenaris (Siat) | Planta Valentín Alsina | Valentín Alsina | Buenos Aires | -34.66222 | -58.40989 | EXACTA | Nominatim/OSM: Tenaris SIAT, Paso de Burgos, Valentín Alsina, Partido de Lanús, Buenos Aires, Argentina (landuse/industrial) |
| IND-SID-011 | Tenaris (Siat, ex línea de Acindar) | Planta Villa Constitución | Villa Constitución | Santa Fe | -33.26470 | -60.28936 | EXACTA | Nominatim/OSM: Tenaris SIAT, Villa Constitución, Municipio de Villa Constitución, Departamento Constitución, Santa Fe, Argentina (landuse/industrial) |
| IND-SID-012 | Tenaris | Planta Villa Mercedes | Villa Mercedes | San Luis | -33.71381 | -65.39887 | EXACTA | Nominatim/OSM: Tenaris Metalmecanica, Ruta Provincial 24, La Adolfina, Municipio de Villa Mercedes, General Pedernera, San Luis, D5733, Argentina (building/industrial) |
| IND-SID-013 | Acerbrag S.A. | Planta Bragado | Bragado | Buenos Aires | -35.11558 | -60.48977 | ESTIMADA | Nominatim/OSM: Bragado, Partido de Bragado, Buenos Aires, Argentina (boundary/administrative) |
| IND-SID-014 | Sipar Gerdau | Planta Pérez | Pérez | Santa Fe | -33.00727 | -60.81567 | EXACTA | Nominatim/OSM: GERDAU, Pérez, Municipio de Pérez, Gran Rosario, Departamento Rosario, Santa Fe, S2121, Argentina (landuse/industrial) |
| IND-SID-015 | Aceros Zapla | Planta Palpalá | Palpalá | Jujuy | -24.24762 | -65.19768 | EXACTA | Nominatim/OSM: Aceros Zapla, El Brete, Municipio de Palpalá, Departamento Palpalá, Jujuy, Argentina (landuse/industrial) |
| IND-SID-016 | Aluar Aluminio Argentino S.A.I.C. | Planta Puerto Madryn | Puerto Madryn | Chubut | -42.73902 | -65.05338 | EXACTA | Nominatim/OSM: Aluar (Puerto Madryn) Power Plant, Parque Industrial Pesado, Municipio de Puerto Madryn, Departamento Biedma, Chubut, U9120, Argentina (landuse/industrial) |
| IND-SID-017 | Aluar Aluminio Argentino S.A.I.C. | Planta Abasto | Abasto | Buenos Aires | -35.00106 | -58.11949 | EXACTA | Nominatim/OSM: ALUAR, Abasto, Partido de La Plata, Buenos Aires, Argentina (landuse/industrial) |
| IND-SID-018 | Barbieri | Planta de perfiles de acero galvanizado liviano |  |  | -34.84609 | -58.41241 | ESTIMADA | Nominatim/OSM: Parque Industrial Almirante Brown, Villa Hogar Alemán, Burzaco, Partido de Almirante Brown, Buenos Aires, B1852EMM, Argentina (landuse/industrial) |
| IND-ARI-001 | Polo de canteras Tandilia/Ventania | Canteras de granito y basalto | Olavarría | Buenos Aires | -36.89388 | -60.32317 | ESTIMADA | Nominatim/OSM: Olavarría, Partido de Olavarría, Buenos Aires, B7400, Argentina (place/city) |
| IND-ARI-002 | Cerámica San Lorenzo (Grupo Lamosa) | Planta Azul (porcelanato) — dos líneas | Azul | Buenos Aires | -36.74372 | -59.85571 | EXACTA | Nominatim/OSM: Cerámica San Lorenzo, Chacras de Bruno, Azul, Partido de Azul, Buenos Aires, Argentina (landuse/industrial) |
| IND-ARI-003 | Cerámica San Lorenzo (Grupo Lamosa) | Planta San Juan (cerámicos) | San Juan | San Juan | -31.68917 | -68.46399 | ESTIMADA | Nominatim/OSM: Rawson, San Juan, Argentina (boundary/administrative) |
| IND-ARI-004 | Cerro Negro (Sociedad Comercial del Plata) | Planta industrial Buenos Aires |  | Buenos Aires | -36.89388 | -60.32317 | ESTIMADA | Nominatim/OSM: Olavarría, Partido de Olavarría, Buenos Aires, B7400, Argentina (place/city) |
| IND-ARI-006 | Ladrilleras y cavas de arcilla NEA | Polo de extracción y cocción de ladrillo hueco | Resistencia | Chaco | -27.45114 | -58.98651 | ESTIMADA | Nominatim/OSM: Plaza 25 de Mayo de 1810, Resistencia, Municipio de Resistencia, Departamento San Fernando, Chaco, Argentina (leisure/park) |
| IND-VID-001 | VASA - Vidriería Argentina S.A. (NSG-Pilkington + Saint-Gobain) | Planta Llavallol | Llavallol | Buenos Aires | -34.79938 | -58.41741 | EXACTA | Nominatim/OSM: Vidriería Argentina S.A. / Air Liquide, Avenida Antártida Argentina, Llavallol, Partido de Lomas de Zamora, Buenos Aires, 1836, Argentina (man_made/works) |
| IND-VID-002 | VASA - Vidriería Argentina S.A. (NSG-Pilkington + Saint-Gobain) | Planta Los Cardales / Exaltación de la Cruz | Los Cardales | Buenos Aires | -34.33089 | -58.98745 | EXACTA | Nominatim/OSM: Los Cardales, Urquiza, Los Cardales, Partido de Exaltación de la Cruz, Buenos Aires, B2814CMN, Argentina (railway/station) |
| IND-VID-003 | Saint-Gobain Isover | Planta de lana de vidrio Llavallol | Llavallol | Buenos Aires | -34.79657 | -58.43018 | ESTIMADA | Nominatim/OSM: Llavallol, Partido de Lomas de Zamora, Buenos Aires, Argentina (boundary/administrative) |
| IND-VID-004 | Grupo Estisol | Planta EPS Isopor (Novapol) — Pilar | Pilar | Buenos Aires | -34.45709 | -58.91416 | ESTIMADA | Nominatim/OSM: Pilar, Partido del Pilar, Buenos Aires, Argentina (boundary/administrative) |
| IND-VID-005 | Grupo Estisol | Planta Edilteco Sudamericana — Pilar | Pilar | Buenos Aires | -34.45709 | -58.91416 | ESTIMADA | Nominatim/OSM: Pilar, Partido del Pilar, Buenos Aires, Argentina (boundary/administrative) |
| IND-VID-006 | Grupo Estisol | Planta Concrehaus / Modus Building Panels — Pilar | Villa Rosa | Buenos Aires | -34.41626 | -58.87213 | ESTIMADA | Nominatim/OSM: Villa Rosa, Hipólito Yrigoyen, Luchetti, Villa Rosa, Partido del Pilar, Buenos Aires, 1631, Argentina (railway/station) |
| IND-VID-007 | Grupo Estisol | Planta Paperfood — Pilar | Pilar | Buenos Aires | -34.45709 | -58.91416 | ESTIMADA | Nominatim/OSM: Pilar, Partido del Pilar, Buenos Aires, Argentina (boundary/administrative) |
| IND-VID-008 | Grupo Estisol | Planta Estisol Capital Federal | Parque Patricios | Ciudad Autónoma de Buenos Aires | -34.63849 | -58.40631 | ESTIMADA | Nominatim/OSM: Parque Patricios, Monteagudo, Parque Patricios, Buenos Aires, Distrito Tecnológico, Comuna 4, Ciudad Autónoma de Buenos Aires, C1437EYD, Argentina (railway/station) |
| IND-VID-009 | Grupo Estisol | Planta Estisol San Luis | San Luis | San Luis | -33.31751 | -66.37106 | EXACTA | Nominatim/OSM: Parque Industrial Norte, San Luis, Municipio de San Luis, Juan Martín de Pueyrredón, San Luis, Argentina (boundary/administrative) |
| IND-VID-010 | Grupo Estisol | Planta Ecosol | Río Grande | Tierra del Fuego | -53.78583 | -67.70186 | ESTIMADA | Nominatim/OSM: Municipio de Río Grande, Departamento Río Grande, Tierra del Fuego, V9420, Argentina (boundary/administrative) |
| IND-VID-011 | Grupo Estisol | Planta Estisol Famaillá | Famaillá | Tucumán | -27.05436 | -65.40204 | ESTIMADA | Nominatim/OSM: Municipio de Famaillá, Departamento Famaillá, Tucumán, T4132, Argentina (boundary/administrative) |
| IND-HID-001 | Grupo DEMA | Planta industrial San Justo | San Justo | Buenos Aires | -34.68118 | -58.54944 | EXACTA | Nominatim/OSM: Grupo Dema, 3750, Avenida Presidente Juan Domingo Perón, Villa Sahores, San Justo, Partido de La Matanza, Buenos Aires, 1754, Argentina (building/industrial) |
| IND-HID-002 | Industrias Saladillo S.A. | Planta Parque Industrial Pilar | Pilar | Buenos Aires | -34.40745 | -58.97367 | EXACTA | Nominatim/OSM: Industrias Saladillo S.A., 2639, Calle 9, Parque industrial Pilar, Fátima, Partido del Pilar, Buenos Aires, B1629MXA, Argentina (man_made/works) |
| IND-HID-003 | Amanco Wavin Argentina (Orbia) | Planta Pablo Podestá | Pablo Podestá | Buenos Aires | -34.57976 | -58.60973 | ESTIMADA | Nominatim/OSM: Pablo Podestá, Partido de Tres de Febrero, Buenos Aires, Argentina (boundary/administrative) |
| IND-HID-004 | Grupo Rotoplas (mexicano) | Planta Parque Industrial Pilar | Pilar | Buenos Aires | -34.39137 | -58.98303 | EXACTA | Nominatim/OSM: Rotoplas, 358, Calle 22, Parque industrial Pilar, Fátima, Partido del Pilar, Buenos Aires, B1629MXA, Argentina (man_made/works) |
| IND-HID-005 | Grupo Rotoplas (mexicano) | Planta IPS |  |  | -34.56269 | -58.59379 | ESTIMADA | Nominatim/OSM: General San Martín, Metrobús Ruta 8, Uta, Villa Ciudad Jardín El Libertador, Partido de General San Martín, Buenos Aires, B1657, Argentina (highway/bus_stop) |
| IND-HID-006 | Waterplast (Unike Group) | Planta y sede Lanús Oeste | Lanús Oeste | Buenos Aires | -34.70079 | -58.41220 | EXACTA | Nominatim/OSM: 2768, Avenida General José de San Martín, Villa Albariños, Lanús Oeste, Partido de Lanús, Buenos Aires, 1824, Argentina (place/house) |
| IND-HID-007 | Tuboforte / Plásticos Tigre | Planta industrial |  |  | -34.47751 | -58.69077 | ESTIMADA | Nominatim/OSM: Jorge Stephenson, Pablo Nogués, Partido de Malvinas Argentinas, Buenos Aires, B1614ICA, Argentina (highway/residential) |
| IND-MAQ-001 | John Deere Argentina | Planta Granadero Baigorria | Granadero Baigorria | Santa Fe | -32.86758 | -60.71263 | EXACTA | Nominatim/OSM: John Deere Argentina, 481, Granadero Baigorria, Municipio de Granadero Baigorria, Gran Rosario, Departamento Rosario, Santa Fe, 2152, Argentina (landuse/industrial) |
| IND-MAQ-002 | Pauny S.A. (ex Zanello) | Planta Las Varillas | Las Varillas | Córdoba | -31.87923 | -62.71853 | EXACTA | Nominatim/OSM: Pauny S.A., Las Varillas, Municipio de Las Varillas, Pedanía Sacanta, Departamento San Justo, Córdoba, X2400, Argentina (landuse/industrial) |
| IND-MAQ-003 | Pauny S.A. | Planta Santiago del Estero | Santiago del Estero | Santiago del Estero | -27.73571 | -64.24344 | ESTIMADA | Nominatim/OSM: La Banda, Municipio de La Banda, Departamento Banda, Santiago del Estero, G4300, Argentina (boundary/administrative) |
| IND-MAQ-004 | Agrinar (ex planta Massey Ferguson) | Planta Granadero Baigorria | Granadero Baigorria | Santa Fe | -32.85425 | -60.70277 | EXACTA | Nominatim/OSM: Agrinar, Urquiza, El Paraíso, Granadero Baigorria, Municipio de Granadero Baigorria, Gran Rosario, Departamento Rosario, Santa Fe, 2152, Argentina (building/industrial) |
| IND-MAQ-005 | CNH Industrial | Planta Córdoba (Case IH / New Holland) | Córdoba | Córdoba | -31.46245 | -64.10590 | ESTIMADA | Nominatim/OSM: Ferreyra, Avenida Amadeo Sabattini, Nicolás Avellaneda, Córdoba, Municipio de Córdoba, Pedanía Capital, Departamento Capital, Córdoba, X5020, Argentina (railway/station) |
| IND-MAQ-006 | Agrale Argentina | Planta de montaje Mercedes | Mercedes | Buenos Aires | -34.65629 | -59.33237 | EXACTA | Nominatim/OSM: Agrale Argentina, Partido de Mercedes, Buenos Aires, Argentina (landuse/industrial) |
| IND-MAQ-008 | Metalúrgica Hermann S.R.L. | Planta Parque Industrial Gualeguaychú | Gualeguaychú | Entre Ríos | -33.03256 | -58.60890 | EXACTA | Nominatim/OSM: Parque Industrial Gualeguaychú, Gualeguaychú, Distrito Costa Uruguay Sur, Departamento Gualeguaychú, Entre Ríos, Argentina (landuse/industrial) |
| IND-MAQ-009 | Sola y Brusa S.A. | Planta Franck | Franck | Santa Fe | -31.57806 | -60.93554 | EXACTA | Nominatim/OSM: Sola y Brusa S.A, San Martín, Franck, Municipio de Franck, Departamento Las Colonias, Santa Fe, S3009WAA, Argentina (man_made/works) |
| IND-MAQ-010 | Semirremolques Vulcano S.A. | Planta Las Rosas | Las Rosas | Santa Fe | -32.47060 | -61.58754 | EXACTA | Nominatim/OSM: 1151, Avenida Dickinson, Municipio de Las Rosas, Las Rosas, Departamento Belgrano, Santa Fe, S2520, Argentina (place/house) |
| IND-MAQ-011 | Helvética S.A. | Planta Cañada de Gómez | Cañada de Gómez | Santa Fe | -32.81366 | -61.39877 | EXACTA | Nominatim/OSM: Helvética, 1291, Cañada de Gómez, Municipio de Cañada de Gómez, Departamento Iriondo, Santa Fe, 2500, Argentina (landuse/industrial) |
| IND-MAQ-012 | Randon Argentina S.A. (brasileña) | Planta en Argentina |  |  | -33.05752 | -60.61961 | ESTIMADA | Nominatim/OSM: Alvear, Municipio de Alvear, Gran Rosario, Departamento Rosario, Santa Fe, Argentina (boundary/administrative) |
| IND-MAQ-013 | Lambert Hermanos | Planta Concepción del Uruguay | Concepción del Uruguay | Entre Ríos | -32.48519 | -58.23202 | ESTIMADA | Nominatim/OSM: Concepción del Uruguay, Distrito Molino, Departamento Uruguay, Entre Ríos, Argentina (boundary/administrative) |
| IND-MAQ-014 | Acoplados Gross (Sucesores de Emilio Gross S.R.L.) | Planta General Ramírez | General Ramírez | Entre Ríos | -32.17225 | -60.19582 | EXACTA | Nominatim/OSM: Avenida República de Entre Ríos, Barrio San Carlos, General Ramírez, Distrito Isletas, Departamento Diamante, Entre Ríos, 3164, Argentina (highway/tertiary) |
| IND-MAQ-015 | Cometto S.A. | Planta Tortuguitas | Tortuguitas | Buenos Aires | -34.47051 | -58.75871 | ESTIMADA | Nominatim/OSM: Tortuguitas, Partido de Malvinas Argentinas, Buenos Aires, 1667, Argentina (boundary/administrative) |
| IND-MAQ-016 | Danés S.R.L. | Planta Roldán | Roldán | Santa Fe | -32.86373 | -60.88295 | EXACTA | Nominatim/OSM: Danés SRL, Ruta Nacional A012, Villa Eduardito, Roldán, Municipio de Roldán, Gran Rosario, Departamento San Lorenzo, Santa Fe, S2134, Argentina (man_made/works) |
| IND-MAQ-017 | SICA Metalúrgica Argentina S.A. | Planta Esperanza | Esperanza | Santa Fe | -31.43731 | -60.94941 | EXACTA | Nominatim/OSM: Sica Metalúrgica Argentina S.A., 3746, Kreder, Esperanza, Municipio de Esperanza, Departamento Las Colonias, Santa Fe, 3080, Argentina (craft/metal_construction) |
| IND-MAQ-018 | Taboga Hnos. S.A.C.I. | Planta Marcos Juárez | Marcos Juárez | Córdoba | -32.69469 | -62.10439 | ESTIMADA | Nominatim/OSM: Municipio de Marcos Juárez, Pedanía Espinillos, Departamento Marcos Juárez, Córdoba, X2580, Argentina (boundary/administrative) |
| IND-MAQ-019 | INDASYC S.A. | Planta Trelew | Trelew | Chubut | -43.25312 | -65.30944 | ESTIMADA | Nominatim/OSM: Trelew, Municipio de Trelew, Departamento Rawson, Chubut, U9100, Argentina (place/city) |
| IND-MOL-001 | Molino Cañuelas (Grupo Navilli) | Planta Cañuelas | Cañuelas | Buenos Aires | -35.05753 | -58.75001 | EXACTA | Nominatim/OSM: Molino Cañuelas, Cañuelas, Partido de Cañuelas, Buenos Aires, Argentina (landuse/industrial) |
| IND-MOL-002 | Molino Cañuelas (Grupo Navilli) | Planta Carlos Spegazzini (Ezeiza) | Carlos Spegazzini | Buenos Aires | -34.91042 | -58.59312 | ESTIMADA | Nominatim/OSM: Carlos Spegazzini, Partido de Ezeiza, Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-003 | Molino Cañuelas (Grupo Navilli) | Planta Pilar | Pilar | Buenos Aires | -34.45709 | -58.91416 | ESTIMADA | Nominatim/OSM: Pilar, Partido del Pilar, Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-004 | Molino Cañuelas (Grupo Navilli) | Planta Chacabuco | Chacabuco | Buenos Aires | -34.62970 | -60.47019 | ESTIMADA | Nominatim/OSM: Chacabuco, Acceso a la estación, Chacabuco, Partido de Chacabuco, Buenos Aires, 6740, Argentina (railway/station) |
| IND-MOL-005 | Molino Cañuelas (Grupo Navilli) | Planta San Justo | San Justo | Buenos Aires | -34.67742 | -58.56078 | ESTIMADA | Nominatim/OSM: San Justo, Partido de La Matanza, Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-006 | Molino Cañuelas (Grupo Navilli) | Planta Tres Arroyos | Tres Arroyos | Buenos Aires | -38.37700 | -60.27557 | ESTIMADA | Nominatim/OSM: Tres Arroyos, Partido de Tres Arroyos, Buenos Aires, B7500, Argentina (boundary/administrative) |
| IND-MOL-007 | Molino Cañuelas (Grupo Navilli) | Planta Pigüé | Pigüé | Buenos Aires | -37.60517 | -62.41170 | EXACTA | Nominatim/OSM: Molino Cañuelas, Ducós, Pigüé, Cuartel II, Partido de Saavedra, Buenos Aires, Argentina (landuse/industrial) |
| IND-MOL-008 | Molino Cañuelas (Grupo Navilli) | Planta Rosario | Rosario | Santa Fe | -32.95936 | -60.66170 | ESTIMADA | Nominatim/OSM: Rosario, Municipio de Rosario, Gran Rosario, Departamento Rosario, Santa Fe, S2000, Argentina (boundary/administrative) |
| IND-MOL-009 | Molino Cañuelas (Grupo Navilli) | Planta Santa Fe Capital | Santa Fe | Santa Fe | -31.64749 | -60.64286 | ESTIMADA | Nominatim/OSM: Santa Fe Capital, Departamento La Capital, Santa Fe, S3000, Argentina (boundary/administrative) |
| IND-MOL-010 | Molino Cañuelas (Grupo Navilli) | Planta Resistencia | Resistencia | Chaco | -27.45114 | -58.98651 | ESTIMADA | Nominatim/OSM: Plaza 25 de Mayo de 1810, Resistencia, Municipio de Resistencia, Departamento San Fernando, Chaco, Argentina (leisure/park) |
| IND-MOL-011 | Molino Cañuelas (Grupo Navilli) | Planta Realicó | Realicó | La Pampa | -35.03016 | -64.23456 | EXACTA | Nominatim/OSM: Planta Industrial Molino Cañuelas Realicó, Quintas Norte, Realicó, Municipio de Realicó, Departamento Realicó, La Pampa, L6200, Argentina (landuse/industrial) |
| IND-MOL-012 | Molino Cañuelas (Grupo Navilli) | Planta Salta Capital | Salta | Salta | -24.78929 | -65.41032 | ESTIMADA | Nominatim/OSM: Salta, Capital, Salta, Argentina (boundary/administrative) |
| IND-MOL-013 | Molino Cañuelas (Grupo Navilli) | Planta Adelia María | Adelia María | Córdoba | -33.62510 | -64.03028 | EXACTA | Nominatim/OSM: Molino Cañuelas S.A.C.I.F.I.A., Roque Sáenz Peña, Adelia María, Municipio de Adelia María, Pedanía Cautiva, Departamento Río Cuarto, Córdoba, X5800, Argentina (man_made/works) |
| IND-MOL-014 | Molino Florencia (Grupo Cañuelas) | Planta Laboulaye | Laboulaye | Córdoba | -34.12864 | -63.39058 | ESTIMADA | Nominatim/OSM: Municipio de Laboulaye, Pedanía La Amarga, Departamento Presidente Roque Sáenz Peña, Córdoba, X6120, Argentina (boundary/administrative) |
| IND-MOL-015 | Molino Florencia (Grupo Cañuelas) | Planta Córdoba Capital | Córdoba | Córdoba | -31.41669 | -64.18342 | ESTIMADA | Nominatim/OSM: Córdoba, Municipio de Córdoba, Pedanía Capital, Departamento Capital, Córdoba, X5000, Argentina (boundary/administrative) |
| IND-MOL-016 | Molino Cañuelas (Grupo Navilli) | Terminal Las Palmas (puerto propio) | Zárate | Buenos Aires | -34.09547 | -59.02451 | ESTIMADA | Nominatim/OSM: Zárate, Partido de Zárate, Buenos Aires, 2800, Argentina (place/city) |
| IND-MOL-017 | Cargill SACI | Planta Pilar | Pilar | Buenos Aires | -34.40025 | -58.97698 | EXACTA | Nominatim/OSM: Cargill Pilar, 3467, Calle 9, Parque industrial Pilar, Fátima, Partido del Pilar, Buenos Aires, B1629MXA, Argentina (man_made/works) |
| IND-MOL-018 | José Minetti y Cía. Ltda. | Planta Córdoba | Córdoba | Córdoba | -31.44913 | -64.21988 | EXACTA | Nominatim/OSM: Molino José Minetti, Villa La Lonja, SMATA, Córdoba, Municipio de Córdoba, Pedanía Capital, Departamento Capital, Córdoba, X5000, Argentina (landuse/industrial) |
| IND-MOL-019 | Molinos Río de la Plata | Planta histórica Puerto Madero | Puerto Madero | Ciudad Autónoma de Buenos Aires | -34.61038 | -58.36221 | ESTIMADA | Nominatim/OSM: Puerto Madero, Buenos Aires, Comuna 1, Ciudad Autónoma de Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-020 | Compañía Molinera del Sur SACEI | Planta Bahía Blanca | Bahía Blanca | Buenos Aires | -38.71765 | -62.26549 | ESTIMADA | Nominatim/OSM: Bahía Blanca, Cuartel I, Partido de Bahía Blanca, Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-021 | Molino Tres Arroyos | Planta Tres Arroyos | Tres Arroyos | Buenos Aires | -38.37700 | -60.27557 | ESTIMADA | Nominatim/OSM: Tres Arroyos, Partido de Tres Arroyos, Buenos Aires, B7500, Argentina (boundary/administrative) |
| IND-MOL-022 | Nodos Up-River (acopio y molienda de granos) | Terminales portuarias Up-River | San Lorenzo | Santa Fe | -32.74549 | -60.74309 | ESTIMADA | Nominatim/OSM: San Lorenzo, Municipio de San Lorenzo, Gran Rosario, Departamento San Lorenzo, Santa Fe, Argentina (boundary/administrative) |
| IND-MOL-023 | Cuenca lechera Santa Fe centro | Polo de usinas lácteas | Rafaela | Santa Fe | -31.25269 | -61.49168 | ESTIMADA | Nominatim/OSM: Rafaela, Municipio de Rafaela, Departamento Castellanos, Santa Fe, S2300, Argentina (boundary/administrative) |
| IND-MOL-024 | Cuenca lechera Córdoba este | Polo de usinas lácteas | Villa María | Córdoba | -32.41062 | -63.24358 | ESTIMADA | Nominatim/OSM: Villa María, Municipio de Villa María, Pedanía Villa María, Departamento General San Martín, Córdoba, X5900, Argentina (boundary/administrative) |
| IND-MOL-025 | Cuenca lechera Buenos Aires (abasto y oeste) | Polo de usinas lácteas | Cañuelas | Buenos Aires | -35.05403 | -58.76174 | ESTIMADA | Nominatim/OSM: Cañuelas, Partido de Cañuelas, Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-026 | Mastellone Hnos. S.A. (La Serenísima) | Complejo Industrial Pascual Mastellone | General Rodríguez | Buenos Aires | -34.59432 | -58.95226 | EXACTA | Nominatim/OSM: La Serenísima, Parque Irigoyen, General Rodríguez, Partido de General Rodríguez, Buenos Aires, Argentina (landuse/industrial) |
| IND-MOL-027 | Mastellone Hnos. S.A. (La Serenísima) | Planta Longchamps | Longchamps | Buenos Aires | -34.85803 | -58.38815 | ESTIMADA | Nominatim/OSM: Longchamps, Partido de Almirante Brown, Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-028 | Mastellone Hnos. S.A. (La Serenísima) | Planta Trenque Lauquen | Trenque Lauquen | Buenos Aires | -35.97311 | -62.73288 | ESTIMADA | Nominatim/OSM: Trenque Lauquen, Partido de Trenque Lauquen, Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-029 | Mastellone Hnos. S.A. (La Serenísima) | Planta Leubucó | Leubucó | Buenos Aires | -36.87218 | -63.03987 | EXACTA | Nominatim/OSM: Leubucó, Partido de Adolfo Alsina, Buenos Aires, Argentina (place/hamlet) |
| IND-MOL-030 | Mastellone Hnos. S.A. (La Serenísima) | Planta Tandil | Tandil | Buenos Aires | -37.32829 | -59.13570 | ESTIMADA | Nominatim/OSM: Tandil, Partido de Tandil, Buenos Aires, Argentina (boundary/administrative) |
| IND-MOL-031 | Mastellone Hnos. S.A. (La Serenísima) | Planta Canals | Canals | Córdoba | -33.58922 | -62.85915 | EXACTA | Nominatim/OSM: Mastellone Hermanos, T-34-07, Municipio de Canals, Pedanía Loboy, Departamento Unión, Córdoba, X2550, Argentina (building/yes) |
| IND-MOL-032 | Mastellone Hnos. S.A. (La Serenísima) | Planta Villa Mercedes | Villa Mercedes | San Luis | -33.63135 | -65.54866 | EXACTA | Nominatim/OSM: Mastellone San Luis, Camino Interfábrica, Altos de Chacabuco, Ciudad Jardín I, Municipio de Villa Mercedes, General Pedernera, San Luis, Argentina (building/industrial) |
| IND-MOL-033 | Mastellone Hnos. S.A. (La Serenísima) | Planta histórica La Martona (ex Vicente Casares) | Vicente Casares | Buenos Aires | -34.96226 | -58.64797 | EXACTA | Nominatim/OSM: Vicente Casares, Ruta Provincial 205, Partido de Cañuelas, Buenos Aires, 1808, Argentina (railway/station) |
| IND-MOL-034 | SanCor Cooperativas Unidas Ltda. | Planta Sunchales (sede central) | Sunchales | Santa Fe | -30.94509 | -61.56081 | ESTIMADA | Nominatim/OSM: Municipio de Sunchales, Departamento Castellanos, Santa Fe, Argentina (boundary/administrative) |
| IND-MOL-035 | SanCor Cooperativas Unidas Ltda. | Planta Gálvez | Gálvez | Santa Fe | -32.04164 | -61.21541 | EXACTA | Nominatim/OSM: Sancor cooperativa limitada, 450, Bulevar Argentino, Florida, Gálvez, Municipio de Gálvez, Departamento San Jerónimo, Santa Fe, S2252, Argentina (man_made/works) |
| IND-MOL-036 | SanCor Cooperativas Unidas Ltda. | Planta San Guillermo | San Guillermo | Santa Fe | -30.36307 | -61.92411 | EXACTA | Nominatim/OSM: Sancor, Presidente General Roca, Municipio de San Guillermo, Departamento San Cristóbal, Santa Fe, 2347, Argentina (man_made/works) |
| IND-MOL-037 | SanCor Cooperativas Unidas Ltda. | Planta Devoto | Devoto | Córdoba | -31.40536 | -62.29081 | EXACTA | Nominatim/OSM: Industria Láctea SanCor, Bulevar 25 de Mayo, Municipio de Devoto, Pedanía Juárez Celman, Departamento San Justo, Córdoba, X2400, Argentina (man_made/works) |
| IND-MOL-038 | SanCor Cooperativas Unidas Ltda. | Planta Balnearia | Balnearia | Córdoba | -31.01283 | -62.66541 | ESTIMADA | Nominatim/OSM: Balnearia, Municipio de Balnearia, Pedanía Concepción, Departamento San Justo, Córdoba, X2400, Argentina (boundary/administrative) |
| IND-MOL-039 | SanCor Cooperativas Unidas Ltda. | Planta La Carlota | La Carlota | Córdoba | -33.41794 | -63.29350 | ESTIMADA | Nominatim/OSM: La Carlota, Municipio de La Carlota, Pedanía La Carlota, Departamento Juárez Celman, Córdoba, X2670, Argentina (boundary/administrative) |
| IND-MOL-040 | Adecoagro (Grupo Lácteo) | Planta Chivilcoy (ex SanCor) | Chivilcoy | Buenos Aires | -34.93646 | -60.00757 | EXACTA | Nominatim/OSM: Adecoagro, Chivilcoy, Partido de Chivilcoy, Buenos Aires, Argentina (landuse/industrial) |
| IND-MOL-041 | Adecoagro (Grupo Lácteo) | Planta Morteros (ex SanCor) | Morteros | Córdoba | -30.71070 | -62.00671 | ESTIMADA | Nominatim/OSM: Morteros, Municipio de Morteros, Pedanía Libertad, Departamento San Justo, Córdoba, X2421, Argentina (boundary/administrative) |
| IND-MOL-042 | Savencia Fromage & Dairy (ex Bongrain) — Milkaut | Planta Milkaut — Franck | Franck | Santa Fe | -31.58687 | -60.93247 | EXACTA | Nominatim/OSM: Milkaut, 1602, Sarmiento, Franck, Municipio de Franck, Departamento Las Colonias, Santa Fe, S3009, Argentina (man_made/works) |
| IND-MOL-043 | Savencia Fromage & Dairy — Ilolay (ex Suc. de Alfredo Williner) | Planta Ilolay — Rafaela | Rafaela | Santa Fe | -31.25269 | -61.49168 | ESTIMADA | Nominatim/OSM: Rafaela, Municipio de Rafaela, Departamento Castellanos, Santa Fe, S2300, Argentina (boundary/administrative) |
| IND-MOL-044 | Saputo Argentina (canadiense, ex Vicentín/CityLab) | Planta Rafaela | Rafaela | Santa Fe | -31.25269 | -61.49168 | ESTIMADA | Nominatim/OSM: Rafaela, Municipio de Rafaela, Departamento Castellanos, Santa Fe, S2300, Argentina (boundary/administrative) |
| IND-MOL-045 | Punta del Agua S.A. | Planta Punta del Agua | Punta del Agua | Córdoba | -32.16413 | -63.46388 | ESTIMADA | Nominatim/OSM: James Craik, Boulevard San Martín, James Craik, Municipio de James Craik, Pedanía Zorros, Departamento Tercero Arriba, Córdoba, X5980, Argentina (railway/station) |
| IND-ENE-001 | Tadeo Czerweny S.A. | Planta industrial Gálvez | Gálvez | Santa Fe | -32.04105 | -61.21421 | EXACTA | Nominatim/OSM: 374, Bulevar Argentino, Florida, Gálvez, Municipio de Gálvez, Departamento San Jerónimo, Santa Fe, S2252BZG, Argentina (place/house) |
| IND-ENE-002 | Prysmian Energía Cables y Sistemas de Argentina | Planta "La Rosa" | Mataderos | Ciudad Autónoma de Buenos Aires | -34.65786 | -58.50176 | ESTIMADA | Nominatim/OSM: Mataderos, Buenos Aires, Comuna 9, Ciudad Autónoma de Buenos Aires, Argentina (boundary/administrative) |
| IND-ENE-003 | IMSA (Industria Metalúrgica Sud Americana) | Planta industrial Merlo | Merlo | Buenos Aires | -34.66143 | -58.73994 | EXACTA | Nominatim/OSM: IMSA, Lago del Bosque, Merlo, Partido de Merlo, Buenos Aires, Argentina (landuse/industrial) |
| IND-ENE-004 | Aluar Aluminio Argentino S.A.I.C. | Central Hidroeléctrica Futaleufú | Futaleufú | Chubut | -43.00767 | -71.96393 | ESTIMADA | Nominatim/OSM: Embalse Amutui Quimei, Departamento Futaleufú, Chubut, Argentina (water/reservoir) |
| IND-ENE-005 | Aluar Aluminio Argentino S.A.I.C. | Parque Eólico Aluar (PEAL) | Puerto Madryn | Chubut | -42.63904 | -65.25908 | EXACTA | Nominatim/OSM: Parque Eólico Aluar I, Departamento Biedma, Chubut, Argentina (landuse/industrial) |
| IND-ENE-006 | Cementos Avellaneda / YPF Luz | Parque Eólico Cementos Avellaneda | Olavarría | Buenos Aires | -36.89388 | -60.32317 | ESTIMADA | Nominatim/OSM: Olavarría, Partido de Olavarría, Buenos Aires, B7400, Argentina (place/city) |

## 3. Capacidades

| ID | Planta | Capacidad declarada (documento) | Capacidad estimada | Confianza | Fuente |
|---|---|---|---|---|---|
| IND-CEM-001 | L'Amalí (I y II) | Línea 2 ("L'Amalí II", 2021, US$350M) sumó ~25% a la producción nacional de la empresa | — | — | DOCUMENTO |
| IND-CEM-002 | Planta Barker | Sin dato público oficial | ~500.000 t/año de cemento (dato histórico de la línea integral); desde 2019 reconvertida a molienda, embolsado y despacho, sin cifra vigente | BAJA | ESTIMACION_EXTERNA: Infoeme (2007, https://www.infoeme.com/nota/2007-2-21-0-0-0-loma-negra-reactivara-la-planta-de-barker-con-carbon-importado) para la cifra histórica; Ámbito (2019, https://www.ambito.com/negocios/loma-negra/fin-al-conflicto-planta-barker-seguira-operando-160-trabajadores-n5038364) y El Economista (2019, https://eleconomista.com.ar/negocios/hubo-acuerdo-cerrara-planta-loma-negra-barker-n25680) confirman que tras el conflicto gremial la planta NO cerró y quedó como centro de molienda y despacho con 160 trabajadores. |
| IND-CEM-003 | Planta Ramallo (molienda con escoria "Ecocemento") | Sin dato público oficial | ~600.000 t/año de cemento con escoria (Ecocemento) | MEDIA | ESTIMACION_EXTERNA: La Nación, "Cemento ecológico en Ramallo" (1999), https://www.lanacion.com.ar/economia/cemento-ecologico-en-ramallo-nid131454/. Arranque en 300.000 t/año ampliable a 600.000 t/año para la planta Ecocemento (joint venture Loma Negra-Siderar); cifra específica de la planta aunque de fuente antigua. |
| IND-CEM-004 | Planta Zapala | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-005 | Planta Catamarca | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-006 | Planta San Juan | Sin dato público oficial | ~400 t/día de producción histórica (≈146.000 t/año); reconvertida en 2019 solo a molienda y despacho, sin cifra vigente | BAJA | ESTIMACION_EXTERNA: BAE Negocios / Cámara Minera San Juan (2019), https://www.baenegocios.com/negocios/Despues-de-60-anos-Loma-Negra-deja-de-producir-cemento-en-San-Juan-20190902-0025.html. Cifra previa al cierre de la línea de clínker; hoy solo muele y ensaca clínker de Catamarca. |
| IND-CEM-007 | Planta Sierras Bayas | Cerrada — 0 | — | — | DOCUMENTO |
| IND-CEM-008 | Malagueño (Centro Industrial Córdoba) | Ampliación 2021 (US$120M): +512.000 t/año clinker y +635.000 t/año cemento; planta de morteros Tector 120.000 t/año | — | — | DOCUMENTO |
| IND-CEM-009 | Planta Campana | Sin dato público oficial | más de 1.000.000 t/año de cemento | ALTA | ESTIMACION_EXTERNA: Holcim Argentina, comunicado "Holcim Argentina celebra los 25 años de su Planta en Campana" (nov. 2024), https://www.holcim.com.ar/prensa/holcim-argentina-celebra-los-25-anos-de-su-planta-en-campana. Fuente oficial de la empresa con cifra directa para esta planta. |
| IND-CEM-010 | Planta Puesto Viejo | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-011 | Planta Capdeville | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-012 | Ex planta Yocsina | Cerrada, producción unificada en Malagueño | — | — | DOCUMENTO |
| IND-CEM-013 | Planta Olavarría (San Jacinto) | Ampliación de línea en curso (obra IMPO en Parque Industrial Olavarría II) | — | — | DOCUMENTO |
| IND-CEM-014 | Planta San Luis (La Calera) | Sin dato público oficial | ~1.000.000 t/año de cemento (ampliada desde 300.000 t/año) | ALTA | ESTIMACION_EXTERNA: International Cement Review / Global Cement Report, https://www.cemnet.com/News/story/162578/cementos-avellaneda-will-raise-capacity-at-its-la-calera-plant-by-2019.html. Prensa especializada del sector con cifra directa (0,3 Mt/a ampliada a 1 Mt/a). |
| IND-CEM-015 | Planta hormigones San Justo | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-016 | Planta hormigones Laferrere | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-017 | Planta hormigones José León Suárez | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-018 | Planta hormigones Campana | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-019 | Planta Pico Truncado | ~480.000 t/año cemento; horno de clinker 2.000 t/día (proyectado a 4.000 t/día); molienda 60 t/h | — | — | DOCUMENTO |
| IND-CEM-020 | Planta Comodoro Rivadavia | Sin dato público oficial | ~345.000 t/año de molienda de cemento (principalmente cemento petrolero) | MEDIA | ESTIMACION_EXTERNA: Informe de Calificación de PCR S.A. (FIX SCR / Allaria, jul. 2024), https://files.allaria.com.ar/attach/Calificaci%C3%B3n_-_Petroqu%C3%ADmica_Comodoro_Rivadavia_S.A._-_PCR_(1).pdf. Cifra específica de molienda en Comodoro (distinta de Pico Truncado); MEDIA por no lograr cita textual directa del PDF. |
| IND-CEM-021 | Planta Cienaguita (4 hornos MAERZ) | 600.000 t/año (tras 4° horno, 2025); horno 3 individual: 120.000 t/año | — | — | DOCUMENTO |
| IND-CEM-022 | Planta Albardón (La Laja) — "Minera Tea" | 600.000 t/año, en ampliación a 760.000 t/año (1ª etapa) y proyectado a 920.000 t/año (inversión total US$100M) | — | — | DOCUMENTO |
| IND-CEM-023 | Planta Los Berros (ex La Buena Esperanza) | Incluida en capacidad consolidada de Sibelco San Juan | — | — | DOCUMENTO |
| IND-CEM-024 | Planta El Villicum (ex El Volcán) | Incluida en capacidad consolidada de Sibelco San Juan | — | — | DOCUMENTO |
| IND-CEM-025 | Planta Los Berros (marca "El Milagro") | ~200.000 t/año (previo a duplicación proyectada a 2019) | — | — | DOCUMENTO |
| IND-CEM-026 | Planta Jáchal (ex "El Refugio") | Parte del total provincial | — | — | DOCUMENTO |
| IND-CEM-027 | Planta Quilpo | Cerrada — operación cesada en 2017 | — | — | DOCUMENTO |
| IND-CEM-028 | Planta Malagueño ("Cal Malagueño") | Incluida en capacidad consolidada de Calidra Cono Sur | — | — | DOCUMENTO |
| IND-CEM-029 | Planta Olavarría | Incluida en capacidad consolidada de Calidra Cono Sur (>920.000 t/año junto con Albardón, Quilpo histórico, Olavarría y Zapala) | — | — | DOCUMENTO |
| IND-CEM-030 | Planta Zapala | Incluida en capacidad consolidada de Calidra Cono Sur | — | — | DOCUMENTO |
| IND-CEM-031 | Planta Luján de Cuyo | Mayor capacidad productiva de placas de yeso y masillas en polvo de Sudamérica (cifra propia no desagregada) | — | — | DOCUMENTO |
| IND-CEM-032 | Planta Chimbas | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-033 | Complejo industrial General Acha | 24.000.000 m²/año (ampliada desde 7,5 M m²/año original tras inversión de US$19M en 1997) | — | — | DOCUMENTO |
| IND-CEM-034 | Plantas Malargüe (2 plantas) | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-035 | Planta General Roca — yesera histórica (barrio Stefenelli) | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-CEM-036 | Nueva planta Parque Industrial Roca II | ~70 empleos directos, ~200 indirectos | ~20.000.000 m²/año de placas de yeso (capacidad de proyecto anunciada) | MEDIA | ESTIMACION_EXTERNA: Municipio de General Roca, https://www.generalroca.gov.ar/durlock-proyecta-instalar-nueva-planta-en-el-parque-industrial-ii/ y Gobierno de Río Negro (2018). Capacidad de diseño anunciada, no necesariamente la producción alcanzada. |
| IND-CEM-037 | Planta San Justo (fibrocemento) | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-SID-001 | Planta Savio / San Nicolás | Capacidad histórica ampliada desde 2,5 Mt (1974); nueva colada continua +500.000 t/año planchones | — | — | DOCUMENTO |
| IND-SID-002 | Planta Haedo | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-SID-003 | Planta Canning | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-SID-004 | Planta Ensenada | Sin dato público oficial | ~1.360.000 t/año (cifra histórica del Plan Siderúrgico Nacional para Propulsora, no confirmada para la planta actual) | BAJA | ESTIMACION_EXTERNA: Cuadernos FHyCS-UNJu sobre el Plan Siderúrgico Nacional (http://revista.fhycs.unju.edu.ar/revistacuadernos/index.php/cuadernos/rt/printerFriendly/26/59) y El Día (2001). Cifra planificada de integración siderúrgica de Propulsora, no la laminación en frío vigente. |
| IND-SID-005 | Planta Florencio Varela | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-SID-006 | Planta Villa Constitución | ~60% de la capacidad instalada nacional en laminados no planos | — | — | DOCUMENTO |
| IND-SID-007 | Planta San Nicolás | Sin dato público oficial | Cifra grupal ArcelorMittal Acindar (5 plantas): entre 1.350.000 y 1.750.000 t/año de acero | BAJA | ESTIMACION_EXTERNA: El Cronista (2025, https://www.cronista.com/negocios/acindar-frena-su-planta-por-un-mes-y-proyecta-otro-ano-de-baja-produccion/) menciona 1,75 Mt/año; presentación institucional ArcelorMittal Acindar (2023, https://www.cpcesfe2.org.ar/wp-content/uploads/2023/10/Andrea-Dala-ArcelorMittal-Acindar.pdf) indica 1,35 Mt/año. Cifras de grupo, no de la planta. |
| IND-SID-008 | Planta La Tablada | Sin dato público oficial | Cifra grupal ArcelorMittal Acindar (5 plantas): ~1.350.000-1.750.000 t/año de acero | BAJA | ESTIMACION_EXTERNA: mismas fuentes que San Nicolás (El Cronista 2025 y presentación ArcelorMittal Acindar 2023). La Tablada es la planta de productos terminados/trefilados; sin capacidad desagregada. |
| IND-SID-009 | Planta Campana | 900.000 t/año | — | — | DOCUMENTO |
| IND-SID-010 | Planta Valentín Alsina | Sin dato público oficial | ~350.000 t/año de tubos soldados de gran diámetro | MEDIA | ESTIMACION_EXTERNA: Agencia Comunas (2022, https://www.agenciacomunas.com.ar/grindetti-visito-la-planta-de-siat-tenaris-en-valentin-alsina/): mayor fábrica de tubos soldados de gran diámetro del país, 350.000 t sobre 30 ha. Fuente periodística local, no reporte corporativo. |
| IND-SID-011 | Planta Villa Constitución | 80.000 t/año (capacidad de la línea adquirida a Acindar en 2006) | — | — | DOCUMENTO |
| IND-SID-012 | Planta Villa Mercedes | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-SID-013 | Planta Bragado | Sin dato público oficial | ~250.000 t/año de acero largo (capacidad instalada histórica; planta suspendida desde agosto 2025) | MEDIA | ESTIMACION_EXTERNA: SiderDato (https://siderdato.com/noticia/acerbrag-usina-acero-largo-bragado-argentina): 250.000 t/año y 25% del mercado (2007); Infobae (2025, https://www.infobae.com/economia/2025/08/06/la-principal-fabrica-de-bragado-suspendio-su-produccion-y-hay-600-empleos-en-riesgo/) confirma ~23.000 t/mes antes de suspender operaciones. |
| IND-SID-014 | Planta Pérez | Parte del total nacional de 7 Mt/año de acero crudo (capacidad instalada país) | ~650.000 t/año de laminación de barras; ~250.000 t/año de acero crudo (acería eléctrica 2017) | ALTA | ESTIMACION_EXTERNA: Global Energy Monitor (https://www.gem.wiki/Gerdau_Sipar_P%C3%A9rez_steel_plant), El Cronista (2017, https://www.cronista.com/negocios/Gerdau-invirtio-us-232-millones-en-Santa-Fe-para-sustituir-importaciones-20171101-0024.html) y Gobierno de Santa Fe (https://www.santafe.gob.ar/noticias/noticia/259751/). Cifras de la propia planta corroboradas por prensa y fuente gubernamental. |
| IND-SID-015 | Planta Palpalá | Sin dato público oficial | ~180.000 t/año de acero | MEDIA | ESTIMACION_EXTERNA: Wikipedia - Aceros Zapla (https://es.wikipedia.org/wiki/Aceros_Zapla): capacidad instalada de 180.000 t/año del complejo de Palpalá; fuente enciclopédica sin cita primaria verificada. |
| IND-SID-016 | Planta Puerto Madryn | 460.000 t/año de aluminio primario (única planta de aluminio primario del país) | — | — | DOCUMENTO |
| IND-SID-017 | Planta Abasto | 32.000 t/año de elaborados | — | — | DOCUMENTO |
| IND-SID-018 | Planta de perfiles de acero galvanizado liviano | Sin dato público oficial | ~60.000 t/año de acero procesado en perfiles galvanizados (steel frame/drywall) | MEDIA | ESTIMACION_EXTERNA: Forbes Argentina (https://www.forbesargentina.com/liderazgo/barbieri-empresa-familiar-lidera-negocio-perfiles-construccion-seco-procesa-60000-toneladas-acero-n1545): procesa 60.000 t de acero al año; prensa de negocios, no reporte corporativo. |
| IND-ARI-001 | Canteras de granito y basalto | s/d — mayor polo de trituración de rocas del país | — | — | DOCUMENTO |
| IND-ARI-002 | Planta Azul (porcelanato) — dos líneas | Producción anual del grupo: 15.000.000 m²/año (conjunto de plantas) | — | — | DOCUMENTO |
| IND-ARI-003 | Planta San Juan (cerámicos) | Incluida en los 15.000.000 m²/año del grupo | — | — | DOCUMENTO |
| IND-ARI-004 | Planta industrial Buenos Aires | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-ARI-006 | Polo de extracción y cocción de ladrillo hueco | Sector altamente atomizado en pequeñas y medianas ladrilleras; sin dato agregado confiable de capacidad por planta | — | — | DOCUMENTO |
| IND-VID-001 | Planta Llavallol | s/d (en modernización, inversión de US$40M) | — | — | DOCUMENTO |
| IND-VID-002 | Planta Los Cardales / Exaltación de la Cruz | 800-1.000 t/día (según etapa del proyecto, inversión de US$215M) | — | — | DOCUMENTO |
| IND-VID-003 | Planta de lana de vidrio Llavallol | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-VID-004 | Planta EPS Isopor (Novapol) — Pilar | Parte de las 7 plantas del grupo (700+ empleados en total) | — | — | DOCUMENTO |
| IND-VID-005 | Planta Edilteco Sudamericana — Pilar | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-VID-006 | Planta Concrehaus / Modus Building Panels — Pilar | Ampliación de >5.000 m² en 2022 (US$10M, tecnología italiana) | — | — | DOCUMENTO |
| IND-VID-007 | Planta Paperfood — Pilar | 11.500.000 unidades/mes (línea Polipapel) | — | — | DOCUMENTO |
| IND-VID-008 | Planta Estisol Capital Federal | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-VID-009 | Planta Estisol San Luis | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-VID-010 | Planta Ecosol | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-VID-011 | Planta Estisol Famaillá | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-HID-001 | Planta industrial San Justo | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-HID-002 | Planta Parque Industrial Pilar | s/d — empresa líder del segmento sanitario nacional | — | — | DOCUMENTO |
| IND-HID-003 | Planta Pablo Podestá | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-HID-004 | Planta Parque Industrial Pilar | 1 termotanque cada 20 segundos; planta de 6.500 m² cubiertos sobre lote de 12.000 m²; 200 empleados | — | — | DOCUMENTO |
| IND-HID-005 | Planta IPS | Exporta a más de 35 países | — | — | DOCUMENTO |
| IND-HID-006 | Planta y sede Lanús Oeste | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-HID-007 | Planta industrial | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MAQ-001 | Planta Granadero Baigorria | ~1.000 tractores/año (un turno, ampliable con doble turno); ~850-2.500 empleados según ciclo | — | — | DOCUMENTO |
| IND-MAQ-002 | Planta Las Varillas | ~2.000 tractores/año (conjunto de sus dos plantas) | — | — | DOCUMENTO |
| IND-MAQ-003 | Planta Santiago del Estero | Incluida en los ~2.000 tractores/año del grupo | aprox. 15 tractores de 120 HP por mes al inicio de la planta (2006), además de minibuses y motoniveladoras | BAJA | ESTIMACION_EXTERNA: La Nación (2006, https://www.lanacion.com.ar/economia/campo/pauny-zanello-con-una-nueva-planta-en-santiago-del-estero-nid817274/) y bichosdecampo.com: planta de 6.000 m² en el Parque Industrial La Isla (2006) más montaje de 1.650 m² (2012). Cifra de arranque, probablemente desactualizada. |
| IND-MAQ-004 | Planta Granadero Baigorria | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MAQ-005 | Planta Córdoba (Case IH / New Holland) | Sin dato público oficial | hasta 2.000 cosechadoras y 4.000 tractores por año (más hasta 50.000 motores/año en la planta FPT del complejo) | MEDIA | ESTIMACION_EXTERNA: Maquinac.com (2013, 'CNH inauguró su planta industrial en Córdoba') y Cadena3/AgroNoa: complejo de dos plantas (US$130M) en Ferreyra diseñado para 2.000 cosechadoras, 4.000 tractores y 50.000 motores por año. Capacidad de diseño del complejo completo, no desagregada por línea. |
| IND-MAQ-006 | Planta de montaje Mercedes | Sin dato público oficial | aprox. 1.000 unidades/año (capacidad histórica de diseño; ritmo de arranque de 70 a 100 por mes) | BAJA | ESTIMACION_EXTERNA: El Cronista ('Agrale fabricará camiones en la ex planta del 3CV en Mercedes') y autoblog.com.ar: capacidad de diseño de ~1.000 unidades/año para la planta de Ruta 5 km 89,5 (200.000 m²), al momento de su habilitación. |
| IND-MAQ-008 | Planta Parque Industrial Gualeguaychú | Líder nacional desde 2006, ~15% del mercado; planta de 26.500 m² cubiertos en predio de 8 ha; ~130 unidades/mes, ~300 empleados | — | — | DOCUMENTO |
| IND-MAQ-009 | Planta Franck | 2° lugar en patentamientos (77 u./mes en pico reciente); fundada en 1961 | — | — | DOCUMENTO |
| IND-MAQ-010 | Planta Las Rosas | Su titular (Carlos Moriconi) presidió la CAFAS | — | — | DOCUMENTO |
| IND-MAQ-011 | Planta Cañada de Gómez | Líder histórico (fundada en 1904); nave de 15.000 m² cubiertos en predio de 9 ha | — | — | DOCUMENTO |
| IND-MAQ-012 | Planta en Argentina | ~7% del mercado; única de las 12 principales que no es de capital nacional | — | — | DOCUMENTO |
| IND-MAQ-013 | Planta Concepción del Uruguay | 9° en patentamientos nacionales (2020) | — | — | DOCUMENTO |
| IND-MAQ-014 | Planta General Ramírez | 11° en patentamientos nacionales (2020) | — | — | DOCUMENTO |
| IND-MAQ-015 | Planta Tortuguitas | Miembro fundador de CAFAS | — | — | DOCUMENTO |
| IND-MAQ-016 | Planta Roldán | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MAQ-017 | Planta Esperanza | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MAQ-018 | Planta Marcos Juárez | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MAQ-019 | Planta Trelew | Única fábrica del rubro identificada en la Patagonia | — | — | DOCUMENTO |
| IND-MOL-001 | Planta Cañuelas | Molino Cañuelas procesa ~28,5% de la molienda total de trigo del país (grupo, 11 plantas + 2 de Molinos Florencia) | — | — | DOCUMENTO |
| IND-MOL-002 | Planta Carlos Spegazzini (Ezeiza) | Parte de la expansión financiada con crédito IFC/Banco Mundial de US$80M | — | — | DOCUMENTO |
| IND-MOL-003 | Planta Pilar | Incluida en el total de 11 plantas bonaerenses del grupo | — | — | DOCUMENTO |
| IND-MOL-004 | Planta Chacabuco | Incluida en el total de 11 plantas bonaerenses del grupo | — | — | DOCUMENTO |
| IND-MOL-005 | Planta San Justo | Incluida en el total de 11 plantas bonaerenses del grupo | — | — | DOCUMENTO |
| IND-MOL-006 | Planta Tres Arroyos | Incluida en el total de 11 plantas bonaerenses del grupo | — | — | DOCUMENTO |
| IND-MOL-007 | Planta Pigüé | Incluida en el total de 11 plantas bonaerenses del grupo | — | — | DOCUMENTO |
| IND-MOL-008 | Planta Rosario | Incluida en el total de plantas del grupo | — | — | DOCUMENTO |
| IND-MOL-009 | Planta Santa Fe Capital | Incluida en el total de plantas del grupo | — | — | DOCUMENTO |
| IND-MOL-010 | Planta Resistencia | Incluida en el total de plantas del grupo | — | — | DOCUMENTO |
| IND-MOL-011 | Planta Realicó | Incluida en el total de plantas del grupo | — | — | DOCUMENTO |
| IND-MOL-012 | Planta Salta Capital | Incluida en el total de plantas del grupo | — | — | DOCUMENTO |
| IND-MOL-013 | Planta Adelia María | Entre las 4 mayores plantas harineras del país | — | — | DOCUMENTO |
| IND-MOL-014 | Planta Laboulaye | ~720 t/día de molienda | — | — | DOCUMENTO |
| IND-MOL-015 | Planta Córdoba Capital | Sin dato público oficial | Grupo Molino Cañuelas + Molinos Florencia: 130.000-140.000 t/mes de harina de trigo en conjunto (30% de la producción nacional); sin cifra específica para Córdoba Capital | BAJA | ESTIMACION_EXTERNA: infonegocios.info ('Molino Cañuelas, un gigante nacido en el sur cordobés') y molinocanuelas.com/florencia; la única cifra de planta (720 t/día) corresponde a Laboulaye. |
| IND-MOL-016 | Terminal Las Palmas (puerto propio) | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MOL-017 | Planta Pilar | 1.400 t/día — el molino más grande del país | — | — | DOCUMENTO |
| IND-MOL-018 | Planta Córdoba | 820 t/día | — | — | DOCUMENTO |
| IND-MOL-019 | Planta histórica Puerto Madero | Molinos participa con ~35-38% de la molienda de trigo candeal | — | — | DOCUMENTO |
| IND-MOL-020 | Planta Bahía Blanca | ~26-27% de participación en trigo candeal (6.500-7.000 t/mes) | — | — | DOCUMENTO |
| IND-MOL-021 | Planta Tres Arroyos | ~12-13% de participación en trigo candeal (3.500-3.800 t/mes) | — | — | DOCUMENTO |
| IND-MOL-022 | Terminales portuarias Up-River | Mayor polo agroexportador de granos y oleaginosas del país | — | — | DOCUMENTO |
| IND-MOL-023 | Polo de usinas lácteas | Una de las tres principales cuencas lecheras del país | — | — | DOCUMENTO |
| IND-MOL-024 | Polo de usinas lácteas | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MOL-025 | Polo de usinas lácteas | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MOL-026 | Complejo Industrial Pascual Mastellone | Grupo recibe 3.500.000 litros/día a nivel nacional | — | — | DOCUMENTO |
| IND-MOL-027 | Planta Longchamps | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-MOL-028 | Planta Trenque Lauquen | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-MOL-029 | Planta Leubucó | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-MOL-030 | Planta Tandil | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-MOL-031 | Planta Canals | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-MOL-032 | Planta Villa Mercedes | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-MOL-033 | Planta histórica La Martona (ex Vicente Casares) | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MOL-034 | Planta Sunchales (sede central) | Valuada en US$2,4M (subasta 2026) | — | — | DOCUMENTO |
| IND-MOL-035 | Planta Gálvez | Valuada en US$5,5M (subasta 2026) | — | — | DOCUMENTO |
| IND-MOL-036 | Planta San Guillermo | Valuada en US$2,5M (subasta 2026); paralizada desde dic. 2025 | — | — | DOCUMENTO |
| IND-MOL-037 | Planta Devoto | Valuada en US$7M (subasta 2026) | — | — | DOCUMENTO |
| IND-MOL-038 | Planta Balnearia | Valuada en US$5M (subasta 2026) | — | — | DOCUMENTO |
| IND-MOL-039 | Planta La Carlota | Valuada en US$5M (subasta 2026) | — | — | DOCUMENTO |
| IND-MOL-040 | Planta Chivilcoy (ex SanCor) | 1.100.000 litros/día de recepción a nivel grupo | — | — | DOCUMENTO |
| IND-MOL-041 | Planta Morteros (ex SanCor) | Incluida en el total del grupo | — | — | DOCUMENTO |
| IND-MOL-042 | Planta Milkaut — Franck | Grupo recibe 1.700.000 litros/día a nivel nacional | — | — | DOCUMENTO |
| IND-MOL-043 | Planta Ilolay — Rafaela | Incluida en el total del grupo Savencia | — | — | DOCUMENTO |
| IND-MOL-044 | Planta Rafaela | Líder del ranking 2025-2026: 3.800.000 litros/día de recepción | — | — | DOCUMENTO |
| IND-MOL-045 | Planta Punta del Agua | 1.300.000 litros/día de recepción | entre 1.020.000 y 1.050.000 litros de leche/día de recepción y procesamiento | MEDIA | ESTIMACION_EXTERNA: todoagro.com.ar ('Punta del Agua se convirtió en la cuarta empresa láctea de Argentina') y cordobainteriorinforma.com (obras de la planta en James Craik); cifra algo menor a la del documento (1.300.000 l/día), posiblemente por diferencia temporal. |
| IND-ENE-001 | Planta industrial Gálvez | Transformadores de potencia hasta 100-300 MVA y hasta 500 kV | — | — | DOCUMENTO |
| IND-ENE-002 | Planta "La Rosa" | Centro de excelencia sudamericano para cables subterráneos de alta tensión (132-220 kV); inversión de US$15M en nueva línea (2018) | — | — | DOCUMENTO |
| IND-ENE-003 | Planta industrial Merlo | s/d (planta integrada: laminación en caliente y frío de cobre, colada continua de alambrón, líneas de vulcanización y catenaria para MT/AT) | — | — | DOCUMENTO |
| IND-ENE-004 | Central Hidroeléctrica Futaleufú | 560 MW | — | — | DOCUMENTO |
| IND-ENE-005 | Parque Eólico Aluar (PEAL) | 246 MW actuales, proyectado a 582 MW (119 aerogeneradores) | — | — | DOCUMENTO |
| IND-ENE-006 | Parque Eólico Cementos Avellaneda | 63 MW (9 aerogeneradores Nordex Delta 7MW), factor de capacidad 47% | — | — | DOCUMENTO |
| IND-ARI-005 | Planta industrial Córdoba | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-ARI-007 | Plantas industriales de ladrillo hueco | Sin dato público oficial | — | — | NO_DISPONIBLE |
| IND-MAQ-007 | Plantas de palas y retroexcavadoras | Sin dato público oficial | — | — | NO_DISPONIBLE |

## 4. Registros sin georreferenciar

| ID | Empresa | Planta | Categoría | Ubicación en el documento | Motivo |
|---|---|---|---|---|---|
| IND-ARI-005 | Cerro Negro (Sociedad Comercial del Plata) | Planta industrial Córdoba | Áridos, Cerámica Roja y Pisos | Buenos Aires y Córdoba (predios a confirmar) | El documento no da localidad; sólo provincia. No se georreferencia. |
| IND-ARI-007 | Quilmes, Fanelli, Palmar, Later-Cer y otras marcas de ladrillo hueco | Plantas industriales de ladrillo hueco | Áridos, Cerámica Roja y Pisos | Buenos Aires y Litoral (predios individuales no confirmados en esta búsqueda) | Segmento sin registro público centralizado de ubicación planta por planta. |
| IND-MAQ-007 | Grupo Palmero (Michigan-Hanomag), Liugong, TBeH | Plantas de palas y retroexcavadoras | Maquinaria Pesada, Agrícola, Vial y Carrocerías | Argentina (predios individuales no confirmados) | El documento recomienda consulta directa a CIPIBIC. |

## 5. Metodología

1. **Curaduría**: cada fila del documento fuente se transcribió a un registro en `scripts/industria/registros.py`. Las filas agrupadas se desagregaron en un registro por planta. Se excluyeron centros de distribución y sucursales comerciales sin producción, la operación de Uruguay, las marcas comerciales sin planta propia y las filas de resumen que remiten a un desglose posterior.
2. **Geocodificación**: Nominatim / OpenStreetMap (`https://nominatim.openstreetmap.org/search`, `format=jsonv2`, `limit=1`, `countrycodes=ar`), con `User-Agent: LUSAT-GIS/1.0 (github.com/F4brizi/Lusat)` y una pausa mínima de 1.1 s entre consultas. Todas las respuestas —incluidas las negativas— se cachean en `scripts/industria/geocode_cache.json`, de modo que las corridas sucesivas no repiten tráfico contra el servicio público.
3. **Candidatos ordenados**: cada registro declara una lista de consultas. La primera aceptada define la coordenada y la precisión. El orden típico es (a) nombre de empresa/planta + localidad → `EXACTA`; (b) domicilio, parque industrial, paraje o villa fabril → `EXACTA`; (c) centroide de la localidad → `ESTIMADA`.
4. **Regla de aceptación**: un resultado se acepta si existe, si sus coordenadas caen dentro del bounding box continental argentino (lon -74.0..-53.0, lat -55.0..-21.0) y si su `display_name` contiene la localidad o la provincia esperadas (comparación insensible a mayúsculas y acentos). Esto descarta homónimos en otras provincias. Además, un candidato `EXACTA` por nombre de empresa se rechaza si OSM devolvió el centroide administrativo del pueblo (`class` en boundary/place con `type` city/town/village/hamlet/municipality) en lugar de un rasgo real; en ese caso se pasa al siguiente candidato.
5. **Precisión**: `EXACTA` significa que la coordenada corresponde al predio, domicilio o paraje fabril identificado en OSM. `ESTIMADA` significa que la coordenada es el centroide de la localidad, el paraje de referencia o —en el caso de los polos regionales— la ciudad cabecera declarada. No debe usarse una coordenada `ESTIMADA` para mediciones de distancia a nivel predio.
6. **Orden de coordenadas**: los GeoJSON siguen la especificación RFC 7946, es decir `[lon, lat]` en `geometry.coordinates`. Las propiedades `lat` y `lon` se exponen además por separado para consumo directo desde el visor.
7. **Capacidades**: `capacidad_declarada` reproduce lo que dice el documento fuente (`Sin dato público oficial` cuando figura «s/d»). `capacidad_estimada` sólo se completa cuando `scripts/industria/capacidades_estimadas.json` aporta una estimación, y en ese caso se registran también `confianza_estimacion` y `fuente_capacidad_estimada`.

### Advertencias de uso

- Las capacidades del documento fuente provienen de sitios corporativos, AFCP, prensa especializada e informes de calificación; deben contrastarse con la empresa antes de usarse en un análisis de inversión.
- Los nodos `POLO_REGIONAL` no son plantas: representan conjuntos productivos atomizados (canteras de Tandilia, ladrilleras del NEA, nodos Up-River, cuencas lecheras) referenciados en su ciudad cabecera.
- Los nodos con `estado_operativo` `CERRADA` o `EN_QUIEBRA/SUBASTA` se conservan por su valor de inventario histórico y patrimonial.
