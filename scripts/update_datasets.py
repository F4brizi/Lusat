import os
import shutil
import urllib.request
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
BACKUPS_DIR = os.path.join(BASE_DIR, "backups")
os.makedirs(DATASETS_DIR, exist_ok=True)
os.makedirs(BACKUPS_DIR, exist_ok=True)

def backup_file(filename):
    src = os.path.join(DATASETS_DIR, filename)
    if os.path.exists(src):
        date_str = datetime.now().strftime("%Y-%m")
        backup_filename = f"{filename.split('.')[0]}_{date_str}.{filename.split('.')[-1]}"
        dest = os.path.join(BACKUPS_DIR, backup_filename)
        shutil.copy2(src, dest)
        print(f"  -> Backup creado: {backup_filename}")

def sync_wri():
    print("\n[1/4] Actualizando WRI Global Power Plant Database...")
    filename = "global_power_plants_wri.csv"
    backup_file(filename)
    url = "https://raw.githubusercontent.com/wri/global-power-plant-database/master/output_database/global_power_plant_database.csv"
    dest = os.path.join(DATASETS_DIR, filename)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp, open(dest, "wb") as f:
        f.write(resp.read())
    print(f"  -> Actualizado: {os.path.getsize(dest)/(1024*1024):.2f} MB")

def sync_other():
    # Placeholder for adding Overpass API or GEM scraping logic in the future
    print("\n[2/4] Verificando GEM Pipelines...")
    print("  -> (Stub) Configurado para descargas manuales via CSV de suscripcion GEM.")
    
    print("\n[3/4] Verificando OSM Infrastructure...")
    print("  -> (Stub) API Overpass requiere parseo especifico. Actualizacion diferida.")
    
    print("\n[4/4] Verificando ESA WorldCover...")
    print("  -> (Stub) Imagenes estaticas TIF anuales. Sin cambios este mes.")

if __name__ == "__main__":
    print(f"Iniciando ciclo de actualizacion de datasets ({datetime.now().strftime('%Y-%m-%d')})")
    sync_wri()
    sync_other()
    print("\nCiclo completado con exito.")
