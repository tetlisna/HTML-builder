const { stdin, stdout } = require('process');
const fs = require('fs');

const writeableStream = fs.createWriteStream('02-write-file/some.txt', 'utf-8');
stdout.write('Hello there\n');
stdin.on('data', (data) => {
  const dataStringified = data.toString();
  writeableStream.write(dataStringified);
  if (dataStringified.includes('exit')) {
    stdout.write('Good luck on further study!');
    process.exit();
  }

  // stdout.on('exit', (code) => {
  //   if (code.toString().trim() == 'exit') {
  //     process.exit();
  //   }
    stdin.on('SIGINT', (data) => {
      if (data && data.toString().trim() === 'exit') {
        stdout.write('Good luck on further study!');
        process.exit();
      }
     // console.log(data.toString().trim() === 'exit');
    });
  });
// });

