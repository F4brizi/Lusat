with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("map.addImage('ship-triangle', imageData);", "map.addImage('ship-triangle', imageData, { sdf: true });")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
