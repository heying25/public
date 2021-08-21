const fs = require('fs');
const path = require('path');
const pkgPath = path.resolve(process.cwd(), './package.json');
const pretConfigPath = path.resolve(process.cwd(), './.prettierrc');

const config = `
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "none",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid",
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "auto"
}
`;

if (!fs.existsSync(pkgPath)) {
  console.log('package.json 不存在，请在项目根目录中运行');
} else {
  fs.writeFileSync(pretConfigPath, config.trim());
}
