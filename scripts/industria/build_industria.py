#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Construye los datasets georreferenciados de industria basal argentina.

Uso (desde la raiz del repo):

    python scripts/industria/build_industria.py

Entradas
--------
  scripts/industria/registros.py               registro curado a mano
  scripts/industria/capacidades_estimadas.json (opcional) capacidades estimadas
  scripts/industria/geocode_cache.json         cache en disco de Nominatim

Salidas
-------
  datasets/industria_basal_argentina.geojson
  datasets/industria/industria_<slug>.geojson  (8 archivos, uno por categoria)
  datasets/industria/sin_georreferenciar.json
  datasets/industria/reporte_tecnico.md

El script es idempotente: el cache de geocoding evita repetir consultas y las
salidas se reescriben completas en cada corrida.
"""

from __future__ import annotations

import json
import sys
import time
import unicodedata
from datetime import date
from pathlib import Path
from urllib.parse import urlencode

import requests

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent

sys.path.insert(0, str(SCRIPT_DIR))

from registros import (  # noqa: E402
    CATEGORIA_SLUG,
    CATEGORIAS,
    REGISTROS,
    SIN_DATO,
)

# --------------------------------------------------------------------------
# Configuracion
# --------------------------------------------------------------------------

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "LUSAT-GIS/1.0 (github.com/F4brizi/Lusat)"
SLEEP_SEGUNDOS = 1.1

CACHE_PATH = SCRIPT_DIR / "geocode_cache.json"
CAPACIDADES_PATH = SCRIPT_DIR / "capacidades_estimadas.json"

DATASETS_DIR = REPO_ROOT / "datasets"
INDUSTRIA_DIR = DATASETS_DIR / "industria"
UNIFIED_PATH = DATASETS_DIR / "industria_basal_argentina.geojson"
SIN_GEO_PATH = INDUSTRIA_DIR / "sin_georreferenciar.json"
REPORTE_PATH = INDUSTRIA_DIR / "reporte_tecnico.md"

# Bounding box continental de Argentina (lon_min, lon_max, lat_min, lat_max).
BBOX = (-74.0, -53.0, -55.0, -21.0)

# Clases/tipos de Nominatim que representan el centroide de una localidad y no
# un rasgo fisico: se rechazan para candidatos EXACTA por nombre de empresa.
TIPOS_LUGAR = {"city", "town", "village", "hamlet", "municipality",
               "administrative", "suburb", "neighbourhood", "quarter",
               "isolated_dwelling", "locality"}
CLASES_LUGAR = {"boundary", "place"}

PROPIEDADES_REGISTRO = [
    "id", "empresa", "planta", "categoria", "categoria_cod", "subsector",
    "tipo", "producto_principal", "capacidad_declarada", "origen_materia_prima",
    "estado_operativo", "ubicacion_texto", "localidad", "provincia", "notas",
    "sin_ubicar",
]


# --------------------------------------------------------------------------
# Utilidades
# --------------------------------------------------------------------------

def norm(texto: str) -> str:
    """Minusculas sin acentos, para comparaciones tolerantes."""
    if not texto:
        return ""
    descompuesto = unicodedata.normalize("NFD", texto)
    sin_acentos = "".join(c for c in descompuesto if unicodedata.category(c) != "Mn")
    return sin_acentos.lower().strip()


def alias_provincia(provincia: str) -> list[str]:
    """Variantes aceptables del nombre de provincia dentro de display_name."""
    n = norm(provincia)
    if not n:
        return []
    if n.startswith("ciudad autonoma"):
        return [n, "buenos aires", "caba"]
    if n == "tierra del fuego":
        return [n, "tierra del fuego, antartida e islas del atlantico sur"]
    return [n]


class Geocoder:
    """Cliente Nominatim con cache en disco y rate limit de >=1,1 s."""

    def __init__(self, cache_path: Path):
        self.cache_path = cache_path
        self.cache: dict[str, dict | None] = {}
        if cache_path.exists():
            try:
                self.cache = json.loads(cache_path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                self.cache = {}
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT})
        self.consultas_red = 0
        self.aciertos_cache = 0
        self._ultimo_request = 0.0

    def buscar(self, consulta: str) -> dict | None:
        """Devuelve el resultado cacheado o consulta a Nominatim. None si no hay."""
        if consulta in self.cache:
            self.aciertos_cache += 1
            return self.cache[consulta]

        espera = SLEEP_SEGUNDOS - (time.monotonic() - self._ultimo_request)
        if espera > 0:
            time.sleep(espera)

        params = {
            "format": "jsonv2",
            "limit": 1,
            "countrycodes": "ar",
            "q": consulta,
        }
        resultado: dict | None = None
        try:
            resp = self.session.get(NOMINATIM_URL, params=params, timeout=30)
            self._ultimo_request = time.monotonic()
            self.consultas_red += 1
            if resp.status_code == 200:
                datos = resp.json()
                if datos:
                    d = datos[0]
                    resultado = {
                        "lat": float(d["lat"]),
                        "lon": float(d["lon"]),
                        "display_name": d.get("display_name", ""),
                        "osm_type": d.get("osm_type", ""),
                        "class": d.get("category", d.get("class", "")),
                        "type": d.get("type", ""),
                        "addresstype": d.get("addresstype", ""),
                    }
            else:
                print(f"    [HTTP {resp.status_code}] {consulta}")
        except (requests.RequestException, ValueError, KeyError) as exc:
            self._ultimo_request = time.monotonic()
            print(f"    [ERROR] {consulta}: {exc}")
            return None  # error transitorio: NO se cachea

        # Se cachean tambien los negativos (None) para no reconsultar.
        self.cache[consulta] = resultado
        self.guardar()
        print(f"    [{'OK ' if resultado else 'NIL'}] {consulta}")
        return resultado

    def guardar(self) -> None:
        tmp = self.cache_path.with_suffix(".json.tmp")
        tmp.write_text(
            json.dumps(self.cache, ensure_ascii=False, indent=1),
            encoding="utf-8",
        )
        tmp.replace(self.cache_path)


def dentro_de_argentina(lat: float, lon: float) -> bool:
    lon_min, lon_max, lat_min, lat_max = BBOX
    return lon_min <= lon <= lon_max and lat_min <= lat <= lat_max


def resultado_es_lugar(res: dict) -> bool:
    return res.get("class", "") in CLASES_LUGAR and res.get("type", "") in TIPOS_LUGAR


def aceptar(res: dict | None, candidato: dict, localidad: str, provincia: str) -> bool:
    """Regla de aceptacion de un candidato de geocoding."""
    if not res:
        return False
    if not dentro_de_argentina(res["lat"], res["lon"]):
        return False

    display = norm(res.get("display_name", ""))
    esperado = [norm(localidad)] if localidad else []
    esperado += alias_provincia(provincia)
    esperado = [e for e in esperado if e]
    if esperado and not any(e in display for e in esperado):
        return False

    # Un candidato EXACTA por nombre de empresa debe resolver a un rasgo real,
    # no al centroide del pueblo.
    if candidato.get("solo_feature") and resultado_es_lugar(res):
        return False
    return True


def geocodificar_registro(reg: dict, geo: Geocoder) -> dict | None:
    """Recorre los candidatos del registro; devuelve el primero aceptado."""
    for candidato in reg.get("geocode", []):
        res = geo.buscar(candidato["q"])
        if aceptar(res, candidato, reg.get("localidad", ""), reg.get("provincia", "")):
            return {
                "lat": round(res["lat"], 6),
                "lon": round(res["lon"], 6),
                "precision_ubicacion": candidato["precision"],
                "metodo_geocodificacion": (
                    f"Nominatim/OSM: {res['display_name']} "
                    f"({res.get('class', '')}/{res.get('type', '')})"
                ),
                "consulta_geocodificacion": candidato["q"],
            }
    return None


def geocodificar_consulta_suelta(consulta: str, provincia: str, geo: Geocoder) -> dict | None:
    """Geocodifica una ubicacion aportada por capacidades_estimadas.json."""
    res = geo.buscar(consulta)
    candidato = {"precision": "ESTIMADA", "solo_feature": False}
    if aceptar(res, candidato, "", provincia) or (
        res and dentro_de_argentina(res["lat"], res["lon"]) and not provincia
    ):
        return {
            "lat": round(res["lat"], 6),
            "lon": round(res["lon"], 6),
            "precision_ubicacion": "ESTIMADA",
            "metodo_geocodificacion": (
                f"Nominatim/OSM: {res['display_name']} "
                f"({res.get('class', '')}/{res.get('type', '')})"
            ),
            "consulta_geocodificacion": consulta,
        }
    return None


# --------------------------------------------------------------------------
# Merge de capacidades estimadas
# --------------------------------------------------------------------------

def cargar_capacidades() -> list[dict]:
    if not CAPACIDADES_PATH.exists():
        print("[capacidades] capacidades_estimadas.json no encontrado — se omite el merge.")
        return []
    try:
        datos = json.loads(CAPACIDADES_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        print(f"[capacidades] no se pudo leer el archivo: {exc}")
        return []
    if not isinstance(datos, list):
        print("[capacidades] formato inesperado (se esperaba un array) — se omite.")
        return []
    print(f"[capacidades] {len(datos)} entradas cargadas.")
    return datos


def coincide_capacidad(reg: dict, entrada: dict) -> bool:
    empresa_kw = entrada.get("empresa_keyword") or ""
    if empresa_kw and norm(empresa_kw) not in norm(reg["empresa"]):
        return False

    localidad = entrada.get("localidad")
    if localidad is not None and localidad != "":
        if norm(localidad) != norm(reg.get("localidad", "")):
            return False

    planta_kw = entrada.get("planta_keyword")
    if planta_kw:
        if norm(planta_kw) not in norm(reg.get("planta", "")):
            return False
    return True


def aplicar_capacidades(registros: list[dict], entradas: list[dict], geo: Geocoder) -> None:
    for reg in registros:
        reg["capacidad_estimada"] = None
        reg["confianza_estimacion"] = None
        reg["fuente_capacidad_estimada"] = (
            "DOCUMENTO" if reg["capacidad_declarada"] != SIN_DATO else "NO_DISPONIBLE"
        )
        reg["_ubicacion_encontrada"] = None

    for entrada in entradas:
        for reg in registros:
            if not coincide_capacidad(reg, entrada):
                continue
            if entrada.get("capacidad_estimada") is not None:
                reg["capacidad_estimada"] = entrada.get("capacidad_estimada")
                reg["confianza_estimacion"] = entrada.get("confianza")
                reg["fuente_capacidad_estimada"] = entrada.get(
                    "fuente_capacidad_estimada", "ESTIMACION"
                )
            # Ubicación investigada: aplica a registros sin ubicar y a los marcados
            # "relocalizar" (el documento daba solo provincia o un lugar genérico).
            if entrada.get("ubicacion_encontrada") and (
                reg.get("sin_ubicar") or entrada.get("relocalizar")
            ):
                reg["_ubicacion_encontrada"] = entrada["ubicacion_encontrada"]
                reg["_fuente_ubicacion"] = entrada.get("fuente_ubicacion")

    # Geocodificar las ubicaciones aportadas por la investigación.
    for reg in registros:
        consulta = reg.pop("_ubicacion_encontrada", None)
        fuente_ubicacion = reg.pop("_fuente_ubicacion", None)
        if not consulta:
            continue
        print(f"  [ubicacion investigada] {reg['id']}: {consulta}")
        hit = geocodificar_consulta_suelta(consulta, reg.get("provincia", ""), geo)
        if not hit and consulta.count(",") >= 2:
            # Una dirección de calle puede no existir en OSM: caer a localidad + provincia.
            consulta_localidad = ", ".join(p.strip() for p in consulta.split(",")[-3:])
            print(f"    -> sin resultado; reintento con localidad: {consulta_localidad}")
            hit = geocodificar_consulta_suelta(consulta_localidad, reg.get("provincia", ""), geo)
        if hit:
            reg.update(hit)
            reg["sin_ubicar"] = False
            reg["notas"] = (
                (reg.get("notas", "") + " ").strip()
                + " Ubicación aportada por investigación externa (capacidades_estimadas.json)"
                + (f": {fuente_ubicacion}" if fuente_ubicacion else ".")
            ).strip()


# --------------------------------------------------------------------------
# Salidas
# --------------------------------------------------------------------------

def a_feature(reg: dict) -> dict:
    props = {k: reg.get(k) for k in PROPIEDADES_REGISTRO}
    props.update({
        "lat": reg["lat"],
        "lon": reg["lon"],
        "precision_ubicacion": reg["precision_ubicacion"],
        "metodo_geocodificacion": reg["metodo_geocodificacion"],
        "capacidad_estimada": reg.get("capacidad_estimada"),
        "confianza_estimacion": reg.get("confianza_estimacion"),
        "fuente_capacidad_estimada": reg.get("fuente_capacidad_estimada"),
    })
    return {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [reg["lon"], reg["lat"]]},
        "properties": props,
    }


def escribir_geojson(path: Path, features: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fc = {"type": "FeatureCollection", "features": features}
    path.write_text(
        json.dumps(fc, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def escribir_reporte(geolocalizados: list[dict], sin_ubicar: list[dict],
                     geo: Geocoder) -> None:
    hoy = date.today().isoformat()
    total = len(geolocalizados)
    exacta = sum(1 for r in geolocalizados if r["precision_ubicacion"] == "EXACTA")
    estimada = total - exacta

    por_categoria: dict[str, int] = {}
    for r in geolocalizados:
        por_categoria[r["categoria"]] = por_categoria.get(r["categoria"], 0) + 1

    por_estado: dict[str, int] = {}
    for r in geolocalizados:
        por_estado[r["estado_operativo"]] = por_estado.get(r["estado_operativo"], 0) + 1

    por_tipo: dict[str, int] = {}
    for r in geolocalizados:
        por_tipo[r["tipo"]] = por_tipo.get(r["tipo"], 0) + 1

    L: list[str] = []
    L.append("# Reporte técnico — Industria basal argentina (georreferenciación)")
    L.append("")
    L.append(f"*Generado el {hoy} por `scripts/industria/build_industria.py`.*")
    L.append("")
    L.append("Fuente primaria: `scripts/industria/Geografia_Industrial_Argentina.md`. "
             "Registro curado: `scripts/industria/registros.py`.")
    L.append("")

    L.append("## 1. Resumen")
    L.append("")
    L.append("| Métrica | Valor |")
    L.append("|---|---|")
    L.append(f"| Registros curados | {total + len(sin_ubicar)} |")
    L.append(f"| Nodos georreferenciados (features) | {total} |")
    L.append(f"| Sin georreferenciar | {len(sin_ubicar)} |")
    L.append(f"| Precisión EXACTA | {exacta} |")
    L.append(f"| Precisión ESTIMADA | {estimada} |")
    L.append(f"| Consultas a Nominatim en esta corrida | {geo.consultas_red} |")
    L.append(f"| Aciertos de caché | {geo.aciertos_cache} |")
    L.append("")

    L.append("### Por categoría")
    L.append("")
    L.append("| Categoría | Código | Nodos |")
    L.append("|---|---|---|")
    for cod, nombre in CATEGORIAS.items():
        L.append(f"| {nombre} | {cod} | {por_categoria.get(nombre, 0)} |")
    L.append("")

    L.append("### Por estado operativo")
    L.append("")
    L.append("| Estado | Nodos |")
    L.append("|---|---|")
    for estado in sorted(por_estado):
        L.append(f"| {estado} | {por_estado[estado]} |")
    L.append("")

    L.append("### Por tipo de nodo")
    L.append("")
    L.append("| Tipo | Nodos |")
    L.append("|---|---|")
    for tipo in sorted(por_tipo):
        L.append(f"| {tipo} | {por_tipo[tipo]} |")
    L.append("")

    L.append("## 2. Inventario georreferenciado")
    L.append("")
    L.append("| ID | Empresa | Planta | Localidad | Provincia | Lat | Lon | Precisión | Método |")
    L.append("|---|---|---|---|---|---|---|---|---|")
    for r in geolocalizados:
        metodo = r["metodo_geocodificacion"].replace("|", "/")
        L.append(
            f"| {r['id']} | {r['empresa']} | {r['planta']} | {r['localidad']} | "
            f"{r['provincia']} | {r['lat']:.5f} | {r['lon']:.5f} | "
            f"{r['precision_ubicacion']} | {metodo} |"
        )
    L.append("")

    L.append("## 3. Capacidades")
    L.append("")
    L.append("| ID | Planta | Capacidad declarada (documento) | Capacidad estimada | Confianza | Fuente |")
    L.append("|---|---|---|---|---|---|")
    for r in geolocalizados + sin_ubicar:
        declarada = (r.get("capacidad_declarada") or SIN_DATO).replace("|", "/")
        estimada_v = r.get("capacidad_estimada")
        estimada_txt = "—" if estimada_v in (None, "") else str(estimada_v).replace("|", "/")
        confianza = r.get("confianza_estimacion") or "—"
        fuente = r.get("fuente_capacidad_estimada") or "NO_DISPONIBLE"
        L.append(
            f"| {r['id']} | {r['planta']} | {declarada} | {estimada_txt} | "
            f"{confianza} | {fuente} |"
        )
    L.append("")

    L.append("## 4. Registros sin georreferenciar")
    L.append("")
    if sin_ubicar:
        L.append("| ID | Empresa | Planta | Categoría | Ubicación en el documento | Motivo |")
        L.append("|---|---|---|---|---|---|")
        for r in sin_ubicar:
            motivo = (r.get("notas") or "El documento no consigna una localidad localizable.")
            L.append(
                f"| {r['id']} | {r['empresa']} | {r['planta']} | {r['categoria']} | "
                f"{r['ubicacion_texto'].replace('|', '/')} | {motivo.replace('|', '/')} |"
            )
    else:
        L.append("No hay registros sin georreferenciar.")
    L.append("")

    L.append("## 5. Metodología")
    L.append("")
    L.append("1. **Curaduría**: cada fila del documento fuente se transcribió a un registro "
             "en `scripts/industria/registros.py`. Las filas agrupadas se desagregaron en un "
             "registro por planta. Se excluyeron centros de distribución y sucursales "
             "comerciales sin producción, la operación de Uruguay, las marcas comerciales "
             "sin planta propia y las filas de resumen que remiten a un desglose posterior.")
    L.append("2. **Geocodificación**: Nominatim / OpenStreetMap "
             "(`https://nominatim.openstreetmap.org/search`, `format=jsonv2`, `limit=1`, "
             f"`countrycodes=ar`), con `User-Agent: {USER_AGENT}` y una pausa mínima de "
             f"{SLEEP_SEGUNDOS} s entre consultas. Todas las respuestas —incluidas las "
             "negativas— se cachean en `scripts/industria/geocode_cache.json`, de modo que "
             "las corridas sucesivas no repiten tráfico contra el servicio público.")
    L.append("3. **Candidatos ordenados**: cada registro declara una lista de consultas. "
             "La primera aceptada define la coordenada y la precisión. El orden típico es "
             "(a) nombre de empresa/planta + localidad → `EXACTA`; (b) domicilio, parque "
             "industrial, paraje o villa fabril → `EXACTA`; (c) centroide de la localidad → "
             "`ESTIMADA`.")
    L.append("4. **Regla de aceptación**: un resultado se acepta si existe, si sus "
             "coordenadas caen dentro del bounding box continental argentino "
             f"(lon {BBOX[0]}..{BBOX[1]}, lat {BBOX[2]}..{BBOX[3]}) y si su `display_name` "
             "contiene la localidad o la provincia esperadas (comparación insensible a "
             "mayúsculas y acentos). Esto descarta homónimos en otras provincias. Además, "
             "un candidato `EXACTA` por nombre de empresa se rechaza si OSM devolvió el "
             "centroide administrativo del pueblo (`class` en boundary/place con `type` "
             "city/town/village/hamlet/municipality) en lugar de un rasgo real; en ese caso "
             "se pasa al siguiente candidato.")
    L.append("5. **Precisión**: `EXACTA` significa que la coordenada corresponde al predio, "
             "domicilio o paraje fabril identificado en OSM. `ESTIMADA` significa que la "
             "coordenada es el centroide de la localidad, el paraje de referencia o —en el "
             "caso de los polos regionales— la ciudad cabecera declarada. No debe usarse "
             "una coordenada `ESTIMADA` para mediciones de distancia a nivel predio.")
    L.append("6. **Orden de coordenadas**: los GeoJSON siguen la especificación RFC 7946, "
             "es decir `[lon, lat]` en `geometry.coordinates`. Las propiedades `lat` y `lon` "
             "se exponen además por separado para consumo directo desde el visor.")
    L.append("7. **Capacidades**: `capacidad_declarada` reproduce lo que dice el documento "
             "fuente (`Sin dato público oficial` cuando figura «s/d»). `capacidad_estimada` "
             "sólo se completa cuando `scripts/industria/capacidades_estimadas.json` aporta "
             "una estimación, y en ese caso se registran también `confianza_estimacion` y "
             "`fuente_capacidad_estimada`.")
    L.append("")
    L.append("### Advertencias de uso")
    L.append("")
    L.append("- Las capacidades del documento fuente provienen de sitios corporativos, AFCP, "
             "prensa especializada e informes de calificación; deben contrastarse con la "
             "empresa antes de usarse en un análisis de inversión.")
    L.append("- Los nodos `POLO_REGIONAL` no son plantas: representan conjuntos productivos "
             "atomizados (canteras de Tandilia, ladrilleras del NEA, nodos Up-River, cuencas "
             "lecheras) referenciados en su ciudad cabecera.")
    L.append("- Los nodos con `estado_operativo` `CERRADA` o `EN_QUIEBRA/SUBASTA` se "
             "conservan por su valor de inventario histórico y patrimonial.")
    L.append("")

    REPORTE_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORTE_PATH.write_text("\n".join(L), encoding="utf-8")


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main() -> int:
    print(f"[init] {len(REGISTROS)} registros curados.")
    INDUSTRIA_DIR.mkdir(parents=True, exist_ok=True)

    geo = Geocoder(CACHE_PATH)
    print(f"[init] caché con {len(geo.cache)} consultas previas.")

    registros = [dict(r) for r in REGISTROS]

    # 1) Capacidades estimadas (puede desbloquear registros sin ubicar).
    aplicar_capacidades(registros, cargar_capacidades(), geo)

    # 2) Geocoding.
    geolocalizados: list[dict] = []
    sin_ubicar: list[dict] = []
    for reg in registros:
        if reg.get("lat") is not None and reg.get("lon") is not None:
            geolocalizados.append(reg)  # resuelto vía capacidades_estimadas
            continue
        if reg.get("sin_ubicar") or not reg.get("geocode"):
            sin_ubicar.append(reg)
            continue

        print(f"  {reg['id']} — {reg['empresa']} / {reg['planta']}")
        hit = geocodificar_registro(reg, geo)
        if hit:
            reg.update(hit)
            geolocalizados.append(reg)
        else:
            reg["sin_ubicar"] = True
            reg["notas"] = (
                (reg.get("notas", "") + " ").strip()
                + " Ningún candidato de geocodificación superó la regla de aceptación."
            ).strip()
            sin_ubicar.append(reg)
            print(f"    !! sin resultado aceptable para {reg['id']}")

    geo.guardar()

    # 3) Salidas.
    for reg in geolocalizados:
        reg.pop("geocode", None)
    for reg in sin_ubicar:
        reg.pop("geocode", None)

    features = [a_feature(r) for r in geolocalizados]
    escribir_geojson(UNIFIED_PATH, features)

    for cod, slug in CATEGORIA_SLUG.items():
        sub = [f for f in features if f["properties"]["categoria_cod"] == cod]
        escribir_geojson(INDUSTRIA_DIR / f"industria_{slug}.geojson", sub)
        print(f"[out] industria_{slug}.geojson — {len(sub)} features")

    SIN_GEO_PATH.write_text(
        json.dumps(sin_ubicar, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    escribir_reporte(geolocalizados, sin_ubicar, geo)

    exacta = sum(1 for r in geolocalizados if r["precision_ubicacion"] == "EXACTA")
    print()
    print(f"[done] {len(features)} features "
          f"({exacta} EXACTA / {len(features) - exacta} ESTIMADA), "
          f"{len(sin_ubicar)} sin georreferenciar.")
    print(f"[done] {geo.consultas_red} consultas de red, {geo.aciertos_cache} desde caché.")
    print(f"[done] {UNIFIED_PATH.relative_to(REPO_ROOT)}")
    print(f"[done] {REPORTE_PATH.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
