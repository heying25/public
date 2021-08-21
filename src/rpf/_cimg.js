const path = require('path');
const fs = require('fs');
const childProc = require('child_process');

const npmRootPath = childProc.execSync('npm root -g', {
  encoding: 'utf-8'
});
console.log('npm 全局包路径', npmRootPath);
const imageminGlobalPath = path.resolve(npmRootPath.trim(), 'imagemin');
const mozjpegGlobalPath = path.resolve(
  npmRootPath.trim(),
  'imagemin-mozjpeg-mirror'
);
const pngquantGlobalPath = path.resolve(
  npmRootPath.trim(),
  'imagemin-pngquant-mirror'
);

function checkPkg(pkgPath) {
  if (!fs.existsSync(pkgPath)) {
    const pkgName = path.basename(pkgPath);
    console.log('缺少全局', pkgName);
    console.log('请先运行', `npm i -g ${pkgName}`);
    process.exit(0);
  }
}

checkPkg(imageminGlobalPath);
checkPkg(mozjpegGlobalPath);
checkPkg(pngquantGlobalPath);

const imagemin = require(imageminGlobalPath);
const mozjpeg = require(mozjpegGlobalPath);
const pngquant = require(pngquantGlobalPath);

function parseArgv(argv) {
  return argv.reduce((acc, item) => {
    if (/^--/.test(item)) {
      const kv = item.replace(/^--/, '').split('=');
      if (kv.length === 2) {
        acc[kv[0]] = kv[1];
      }
    }
    return acc;
  }, {});
}

const args = parseArgv(process.argv);

if (!args.path) {
  console.log('缺少 path 参数，--path=path/to/images');
  process.exit(0);
}
if (path.isAbsolute(args.path)) {
  console.log('为了安全，path 参数必须是相对路径');
  process.exit(0);
}

const compressPath = path.resolve(process.cwd(), args.path);
console.log('开始压缩', compressPath, '的图片');

const targetDir = compressPath.replace(/\\/g, '/');

const sizeMapPath = path.resolve(process.cwd(), '.cimg_data');

function getPrevSizeMap() {
  console.log('开始读取 size 映射表', sizeMapPath);
  if (fs.existsSync(sizeMapPath)) {
    let data = {};
    try {
      const fileContent = fs.readFileSync(sizeMapPath);
      data = JSON.parse(fileContent);
    } catch (err) {
      console.log('读取数据文件出错', err.message);
    }
    return data;
  } else {
    return {};
  }
}

function getSizeMapKey(src) {
  return path.relative(process.cwd(), src).replace(/\\/g, '/');
}

function getSizeMap(files) {
  return files.reduce((acc, item) => {
    const { size } = fs.statSync(item.sourcePath);
    acc[getSizeMapKey(item.sourcePath)] = `${size}`;
    return acc;
  }, {});
}

const prevSizeMap = getPrevSizeMap();

console.log('开始压缩...');
imagemin([targetDir + '/**/*.{jpg,png}'], {
  plugins: [
    mozjpeg({
      quality: 75,
      progressive: false
    }),
    pngquant({
      quality: [0.6, 0.8]
    })
  ]
}).then(files => {
  let count = 0;
  const fileSizeMap = getSizeMap(files);

  files.forEach(item => {
    const { sourcePath } = item;
    const key = getSizeMapKey(sourcePath);
    if (prevSizeMap[key] === fileSizeMap[key]) {
      console.log('size 相同，忽略', sourcePath);
    } else {
      console.log('压缩', sourcePath);
      count++;
      fs.writeFileSync(sourcePath, item.data);
    }
  });

  console.log('更新 size 映射表', sizeMapPath);
  const nextSizeMap = getSizeMap(files);
  fs.writeFileSync(
    path.resolve(sizeMapPath),
    JSON.stringify(
      {
        ...prevSizeMap,
        ...nextSizeMap
      },
      null,
      2
    )
  );

  console.log(`压缩了 (${count} / ${files.length}) 张图片`);
});
