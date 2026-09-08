import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Register protocol
text = text.replace(
    'const map = new maplibregl.Map({',
    'let protocol = new pmtiles.Protocol();\n    maplibregl.addProtocol("pmtiles", protocol.tile);\n\n    const map = new maplibregl.Map({'
)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(text)
