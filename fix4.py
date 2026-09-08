import io
with io.open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
print(repr(lines[3972]))
