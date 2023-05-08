const path = require('path');
const fs = require('fs/promises');

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'kb',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

(async () => {
  let pathSecret = path.join(__dirname, 'secret-folder');
  const files = await fs.readdir(pathSecret, { withFileTypes: true });
  try {
    for (const object of files) {

      if (!object.isFile()) continue;
      let pathObj = path.join(pathSecret, object.name);
      const { size } = await fs.stat(pathObj);
      const { name, ext } = path.parse(pathObj);
      const extansion = ext ? ext.split('.')[1] : '';
      console.log(`${name} - ${extansion} - ${formatBytes(size, 3)}`);
    }
  } catch (error) {
    console.log(error);
  }
})();