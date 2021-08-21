const postcss = require('postcss');
const path = require('path');
const imagesize = require('image-size');

function hasProp(name, rule) {
  return rule.some(i => i.prop === name);
}

function vw(px, base = 750, unit = true) {
  return (Math.round(px) / base) * 100 + (unit ? 'vw' : '');
}

function getImgSysPath(baseUrl, filePath, root) {
  if (/^\./.test(filePath)) {
    return path.resolve(path.dirname(root.source.input.file), filePath);
  }
  /* 
    ~@/path/to/img.png (vue-cli alias)
    ~path/to/img.png (cra with jsconfig)
    =>
    path/to/img.png
   */
  const fixedPath = filePath.replace(/^~?@?\/?/, '');
  return path.resolve(process.cwd(), baseUrl, fixedPath);
}

function getBgUrlValue(str) {
  return str
    .trim()
    .replace(/^url\(['"]?/, '')
    .replace(/['"]?\)$/, '');
}

module.exports = postcss.plugin(
  'postcss-auto-bg',
  ({ baseUrl = './src', vwBase = 750 } = {}) => {
    return root => {
      root.walkRules(rule => {
        rule.walkDecls('background-image', decl => {
          if (/^url\(/.test(decl.value)) {
            const bgUrlValue = getBgUrlValue(decl.value);
            if (!/^http/.test(bgUrlValue) && !/^data:/.test(bgUrlValue)) {
              const size = imagesize(getImgSysPath(baseUrl, bgUrlValue, root));
              const hasBgRepeat = hasProp('background-repeat', rule);
              const hasBgSize = hasProp('background-size', rule);
              const hasWidth = hasProp('width', rule);
              const hasHeight = hasProp('height', rule);

              if (!hasBgRepeat) {
                rule.append({
                  prop: 'background-repeat',
                  value: 'no-repeat'
                });
              }
              if (!hasBgSize) {
                rule.append({
                  prop: 'background-size',
                  value: '100%'
                });
              }
              if (!hasWidth) {
                rule.append({
                  prop: 'width',
                  value: vw(size.width, vwBase)
                });
              }
              if (!hasHeight) {
                rule.append({
                  prop: 'height',
                  value: vw(size.height, vwBase)
                });
              }
            }
          }
        });
      });
    };
  }
);
