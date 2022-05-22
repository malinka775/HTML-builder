const fs = require('fs');
const path = require('path');

async function mergeStyles () {
  const dirents = await fs.promises.readdir(path.join(__dirname, 'styles'));
  const styleDirents = dirents.filter(dirent => 
    ( path.parse( path.join( __dirname, 'styles', dirent ) ) ).ext === '.css');
  const writeStream = fs.createWriteStream(path.join( __dirname, 'project-dist', 'bundle.css' ), 'utf-8');
  styleDirents.forEach(async (dirent) => {
    const readStream = fs.createReadStream(path.join( __dirname, 'styles', dirent ));
    readStream.pipe(writeStream);
  });
  
}

mergeStyles();