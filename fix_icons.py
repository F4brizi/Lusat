with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Remove old triangle code
text = re.sub(r'        // Generate Triangle Icon dynamically.*?\);\s*', '', text, flags=re.DOTALL)

triangle_code = '''
        // Generate Triangle Icons dynamically
        const size = 24;
        function createTriangle(color) {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.moveTo(size/2, 2);
          ctx.lineTo(size-2, size-2);
          ctx.lineTo(2, size-2);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#0f172a';
          ctx.stroke();
          return ctx.getImageData(0, 0, size, size);
        }
        map.addImage('ship-triangle-a', createTriangle('#60a5fa'));
        map.addImage('ship-triangle-b', createTriangle('#34d399'));
'''

text = text.replace('setupPopups();', triangle_code + '        setupPopups();')

# Fix layout to use dynamic icon-image
text = text.replace("'icon-image': 'ship-triangle',", "'icon-image': ['case', ['==', ['get', 'shipClass'], 'A'], 'ship-triangle-a', 'ship-triangle-b'],")

# Remove icon-color since the image itself is colored
text = re.sub(r"            'icon-color': \[.*?            \],", "", text, flags=re.DOTALL)
text = re.sub(r"            'icon-halo-color': '#0f172a',.*?            'icon-halo-width': 1", "", text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
