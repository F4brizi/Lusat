with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "'text-field': ' '" in line:
        lines[i] = line.replace("'text-field': ' '", "'text-field': '▲'")
        print('Replaced line', i+1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
