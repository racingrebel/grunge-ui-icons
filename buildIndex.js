const path = require('path');
const fs = require('fs');
const glob = require('glob');
const reserved = require('reserved-words');
const { camelCase, upperFirst } = require('lodash');

const iconDir = process.argv[2];

// converts reserved works if they are found!
function makeSafe(name) {
  const pascalName = upperFirst(camelCase(name));
  const isNumber = !isNaN(parseInt(pascalName));
  const isReserved = reserved.check(pascalName, 6, true);
  const isUnsafe = isReserved || isNumber;
  return isUnsafe ? `_${pascalName}` : pascalName;
}

function indexFiles(dir) {
  const fileIndex = glob
    .sync(path.join(dir, '*.js'))
    .map(file => {
      const name = path.basename(file).replace('.js', '');
      const safeName = makeSafe(name);
      return `export { default as ${safeName} } from './${name}';\n`;
    })
    .join('');
  fs.writeFileSync(path.join(dir, 'index.js'), fileIndex);
}

indexFiles(iconDir);
