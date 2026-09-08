import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the second script tag
scripts = list(re.finditer(r'<script>', text))
script_end = text.find('</script>', scripts[-1].end())

if len(scripts) >= 2 and script_end != -1:
    js_content = text[scripts[-1].end() : script_end]
    
    with open('js/main.js', 'w', encoding='utf-8') as f:
        f.write(js_content.strip() + '\n')
        
    # Replace in index.html
    text = text[:scripts[-1].start()] + '<script src="js/main.js"></script>\n' + text[script_end + 9:]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("JS extracted successfully!")
else:
    print("Script tags not found!")
