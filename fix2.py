import re
with open('index.html', 'r', encoding='utf-8-sig') as f:
    text = f.read()

text = re.sub(r"'text-field': ' '", r"'text-field': '▲'", text, count=1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
