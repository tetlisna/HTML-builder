const { stdin, stdout } = require('process');
const path = require('path');
const fs = require('fs');

const writeableStream = fs.createWriteStream(path.join(__dirname, 'some.txt'), 'utf-8');
stdout.write('Hello there\n');
stdin.on('data', (data) => {
  const dataStringified = data.toString();
  writeableStream.write(dataStringified);
  if (dataStringified.includes('exit')) {
    stdout.write('Good luck on further studying!');
    process.exit();
  }
});
process.on('SIGINT', () => {
  stdout.write('\nGood luck on further studying!');
  process.exit();
});
