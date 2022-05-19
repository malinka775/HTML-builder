const { stdout } = require('process');
const { createReadStream } = require('fs');
const path = require('path');
const rs = createReadStream(path.join(__dirname, 'text.txt'),'utf-8');

rs.on('data', data => {
  stdout.write(data);
});