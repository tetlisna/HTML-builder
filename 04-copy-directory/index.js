const fs = require('fs/promises');
const path = require('path');

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
  const files = await fs.readdir(path.join(__dirname, 'secret-folder'), {
    withFileTypes: true,
  });

  for (const object of files) {
    if (!object.isFile()) continue;

    let filePath = path.join(__dirname, 'secret-folder', object.name);

    const { size } = await fs.stat(
      path.join(__dirname, 'secret-folder', object.name)
    );
    const { name, ext } = path.parse(filePath);
    const extension = ext ? ext.split('.')[1] : '';

    console.log(`${name} - ${extension} - ${formatBytes(size, 3)}`);
  }
})();
