const path = require('path');
const fs = require('fs');
//const { readdir } = require('fs/promises');
let pathSecret = path.join('03-files-in-folder', 'secret-folder');

fs.readdir(pathSecret, { withFileTypes: true }, (err, files) => {
  console.log('\nCurrent directory files:');

  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      let pathFile = path.join('03-files-in-folder', 'secret-folder', file.name);
      console.log(pathFile);
      // if (path.extname(file.name)) {
        fs.stat(pathFile, (error, stats) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Stats object for: ");
            console.log(stats);
            console.log("Path is file:", stats.isFile());
          }
        });
      // }
    });
  }
});
