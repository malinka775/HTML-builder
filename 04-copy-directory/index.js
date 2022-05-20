const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const initialDir = path.join(__dirname, 'files');
const copyOfInitial = path.join(__dirname, 'files-copy');

// (async () => { 
//   const w = await fs.stat(path.join(__dirname, 'copy-files'));
//   console.log(w);
//   if (w) {
//     const copyFiles = await fs.readdir(path.join(__dirname, 'files'));
//     console.log(copyFiles);
//     for (let file of copyFiles) {
//       await fs.rm(path.join(__dirname, 'copy-files', file));
//     }
//     await fs.rmdir(path.join(__dirname, 'copy-files'));
//   }
// })();
async function copyDirFiles (initialPath, destinationPath) {
  try {
    await fsPromises.mkdir(destinationPath, {recursive: true});
    const dirents = await fsPromises.readdir(initialPath, {withFileTypes: true});
    let direntNames = [];
    for (const dirent of dirents) {
      if (dirent.isFile()) {
        direntNames.push(dirent.name);
        const rs = fs.createReadStream(path.join(initialPath, dirent.name),'utf-8');
        const ws = fs.createWriteStream(path.join(destinationPath, dirent.name));
        rs.pipe(ws);
      }
    }    
    const newDirents = await fsPromises.readdir(destinationPath, {withFileTypes: true});
    const direntsToDelete = newDirents.filter((dirent) => !direntNames.includes(dirent.name));
    direntsToDelete.forEach(async (dirent) => {
      await fsPromises.rm(path.join(destinationPath, dirent.name));
    });
  } catch (err) {
    console.error(err);
  }
}
copyDirFiles(initialDir, copyOfInitial);
