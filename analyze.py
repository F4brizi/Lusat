import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

# I will write a regex to find major sections
# 1. Globals (from 'let activeBase = 'satellite';' to the first function)
globals_start = text.find("let activeBase = 'satellite';")
globals_end = text.find('function saveSessionConfig()')
globals_text = text[globals_start:globals_end]

# Wait, this is getting complicated. 
# There are global functions scattered around.
