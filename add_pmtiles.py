import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add PMTiles script
text = text.replace(
    '<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>',
    '<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>\n  <script src="https://unpkg.com/pmtiles@3.2.0/dist/index.js"></script>'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
