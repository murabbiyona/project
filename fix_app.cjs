const fs = require('fs');
let text = fs.readFileSync('src/pages/Students.tsx', 'utf8');

text = text.split('\\`').join('`');
text = text.split('\\$').join('$');
text = text.split('\\{').join('{');
text = text.split('\\}').join('}');

fs.writeFileSync('src/pages/Students.tsx', text, 'utf8');
console.log("Fixed Students.tsx escaping issues");
