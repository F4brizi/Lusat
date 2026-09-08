import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r"        map\.addLayer\(\{\s*id: 'ais-ships-labels'.*?\}\);\s*", "", text, flags=re.DOTALL)
text = re.sub(r"          layout: \{\s*'visibility': 'none'\s*\},", "", text)

toggle = '''function toggleMasterAis(enabled) { 
      saveSessionConfig();
      isAisMasterVisible = enabled;
      const dd = document.getElementById('dropdown-ais');
      if (enabled) dd.classList.remove('disabled');
      else dd.classList.add('disabled');

      if (enabled) {
        connectAisStream();
      } else {
        disconnectAisStream();
      }
      
      updateAisMapSource();
    }'''
text = re.sub(r"    function toggleMasterAis\(enabled\) \{.*?    \}", toggle, text, flags=re.DOTALL)

replace_features = '''const features = [];
      if (!isAisMasterVisible) {
        map.getSource('ais-ships-src').setData({ type: 'FeatureCollection', features: [] });
        return;
      }'''
text = text.replace("const features = [];", replace_features)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
