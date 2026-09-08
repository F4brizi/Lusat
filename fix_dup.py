import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove duplicate declarations
text = text.replace('''    let rawPowerPlants = [];
    let rawOilWells = [];
    let rawMiningProjects = [];
    let rawOilWells = [];
    let rawMiningProjects = [];''', 
'''    let rawPowerPlants = [];
    let rawOilWells = [];
    let rawMiningProjects = [];''')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
