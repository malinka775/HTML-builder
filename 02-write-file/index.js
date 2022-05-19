const fs = require('fs');
const path = require('path');
const process = require('process');

const writeStream = fs.createWriteStream(path.join(__dirname, 'result.txt'));
process.stdout.write('--- Please, enter the text you want to save: ---\n');

process.stdin.on('data', data => {
  if (data.toString().trim() == 'exit') {
    process.exit();
  }
  writeStream.write(data, err => {
    if (err) console.log(err.message);
  });
});

process.on('exit', () => {
  process.stdout.write('--- All the info now is in "02-write-file/result.txt"! Bye! ---');
});