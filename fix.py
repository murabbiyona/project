with open('src/pages/Students.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(r'\`', '`')
code = code.replace(r'\$', '$')
code = code.replace(r'\{', '{')
code = code.replace(r'\}', '}')

with open('src/pages/Students.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
