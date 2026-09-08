with open('index.html', 'r', encoding='utf-8-sig') as f:
    text = f.read()

text = text.replace("'text-field': ' ',", "'text-field': '▲',")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
