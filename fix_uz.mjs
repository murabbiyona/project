import fs from 'fs';

let content = fs.readFileSync('src/locales/uz.json', 'utf8');
content = content.replace(/O'/g, 'O‘')
                 .replace(/o'/g, 'o‘')
                 .replace(/G'/g, 'G‘')
                 .replace(/g'/g, 'g‘')
                 .replace(/ta'til/gi, (match) => match.replace("'", "’"))
                 .replace(/ma'lumot/gi, (match) => match.replace("'", "’"))
                 .replace(/san'at/gi, (match) => match.replace("'", "’"))
                 .replace(/a'lo/gi, (match) => match.replace("'", "’"));
fs.writeFileSync('src/locales/uz.json', content);
