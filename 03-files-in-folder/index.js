const fs = require('fs');
const path = require('path');

async function getDirFiles (pathToDir) {
  try {
    const dirents = await fs.promises.readdir(pathToDir, {withFileTypes: true});
    for (const dirent of dirents) {
      if (dirent.isFile()) {
        const {ext, name} = path.parse(path.join(pathToDir, dirent.name));
        fs.stat(path.join(pathToDir, dirent.name), (err, stats) => {
          if (err) throw err;
          console.log(`${name} - ${ext.slice(1)} - ${stats.size}b`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

getDirFiles(path.join(__dirname, 'secret-folder'));