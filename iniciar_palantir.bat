@echo off
title LUSAT - Visor Tecnico de Infraestructura y Energia
echo ===============================================================================
echo            LUSAT - VISOR TECNICO DE INFRAESTRUCTURA Y ENERGIA
echo ===============================================================================
echo Iniciando servidor local en http://localhost:8085 ...
echo.
echo Para acceder desde tu celular u otras computadoras en esta red WiFi, abre esta direccion:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr IPv4') do echo    http://%%a:8085
echo.
echo Modulos activos:
echo   [1] Centrales Electricas (WRI)      : 34.936 instalaciones (Filtro BBOX y Combustibles)
echo   [2] Ductos e Infraestructura (GEM)  : Oleoductos y gasoductos troncales
echo   [3] Red Electrica y Vias (OSM)      : Alta tension, subestaciones y puertos
echo   [4] Cobertura de Suelo (ESA)        : Superficie agricola y rinde energetico
echo ===============================================================================
echo.
start "" "http://localhost:8085"
python servidor_local.py
pause
