import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'<div class="control-block">\s*<div class="block-header".*?id="dropdown-ais".*?Configurar API Key AIS</button>\s*</div>\s*</div>\s*</div>'
match = re.search(pattern, text, flags=re.DOTALL)
if match:
    block = match.group(0)
    
    # 1. Remove it from current position
    text = text.replace(block, "")
    
    # 2. Modify it
    block = re.sub(r'🚢 Tráfico Marítimo \(AIS\)', '🚢 Entidades en Movimiento', block)
    
    disclaimer = '''              <div style="margin-top:8px;">
                <button class="btn-micro" style="background:rgba(96, 165, 250, 0.15); border-color:#60a5fa; color:#60a5fa; width:100%; justify-content:center;" onclick="openAisKeyModal()">⚙️ Configurar API Key AIS</button>
              </div>
              <div style="margin-top:10px; font-size:10px; color:#64748b; line-height:1.4; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px;">
                <em>Nota: Los datos provienen de redes colaborativas terrestres (T-AIS). La cobertura en estuarios y ríos depende de receptores voluntarios activos y puede ser parcial o nula.</em>
              </div>'''
    block = re.sub(r'              <div style="margin-top:8px;">\s*<button class="btn-micro".*?Configurar API Key AIS</button>\s*</div>', disclaimer, block, flags=re.DOTALL)
    
    # 3. Reinsert
    insert_marker = "        <!-- Mapas Base (100% Libres de Watermarks y sin API Key) -->"
    text = text.replace(insert_marker, block + "\n\n" + insert_marker)
    
    # 4. Remove auto-restore
    text = re.sub(r'          if \(l\.ais\) \{\s*const chk = document\.getElementById\(\'chk-ais\'\);\s*if \(chk\) \{ chk\.checked = true; toggleMasterAis\(true\); \}\s*\}', '', text, flags=re.DOTALL)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Moved successfully!")
else:
    print("Pattern not found!")
