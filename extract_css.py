import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the exact style block
# The style block starts after <title> or <script src="https://unpkg.com/maplibre-gl@3.3.1/dist/maplibre-gl.js"></script>
style_start = text.find('<style>')
style_end = text.find('</style>')

if style_start != -1 and style_end != -1:
    css_content = text[style_start + 7 : style_end]
    
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css_content.strip() + '\n')
        
    # Replace in index.html
    text = text[:style_start] + '<link rel="stylesheet" href="css/style.css">\n' + text[style_end + 8:]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("CSS extracted successfully!")
else:
    print("Style tags not found!")
