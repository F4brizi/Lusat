import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('https://unpkg.com/pmtiles@3.2.0/dist/index.js', 'https://unpkg.com/pmtiles@3.2.0/dist/pmtiles.js')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
