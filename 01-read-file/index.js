const fs = require('fs');
const readableStream = fs.createReadStream('/Users/apple/Downloads/Bored/builder/HTML-builder/01-read-file/text.txt', 'utf-8');

readableStream.on('data', chunk => console.log(chunk));