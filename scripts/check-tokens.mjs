// Rule 9: no hard-coded colours, radii or font sizes outside src/design.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../src', import.meta.url).pathname;
const skip = join(root, 'design');
const colour = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/;
const radiusOrSize = /(border-radius|font-size)\s*:\s*(?![^;]*var\()[^;]*\d/;

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (p === skip) continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(css|tsx?)$/.test(name)) files.push(p);
  }
})(root);

const problems = [];
for (const file of files) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (colour.test(line)) problems.push(`${relative(root, file)}:${i + 1} hard-coded colour`);
      if (file.endsWith('.css') && radiusOrSize.test(line))
        problems.push(`${relative(root, file)}:${i + 1} hard-coded radius or font size`);
    });
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`tokens: ${files.length} files checked, no hard-coded values outside src/design`);
