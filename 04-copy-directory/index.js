const fs = require('fs');
//const fs = require('fs/promises');
const path = require('path');

const originalFilePath = path.join(__dirname, 'files');
const copyFilePath = path.join(__dirname, 'files-copy');

const handleFiles = (err, files) => {
  if (err) throw err;
  for (let file of files) {
    if (!file.isFile()) return;

    fs.copyFile(
      path.join(originalFilePath, file.name),
      path.join(copyFilePath, file.name),
      (err) => {
        if (err) console.log(err);
        console.log(`file ${file.name} copied`);
      }
    );
  }
};
fs.rm(copyFilePath, { recursive: true, force: true }, () => {
  fs.mkdir(copyFilePath, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(originalFilePath, { withFileTypes: true }, handleFiles);
  });
});
