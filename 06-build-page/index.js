const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');


async function getContent (pathToFile) {
  return fsPromises.readFile(pathToFile, 'utf-8', async (error, fileContent) => {
    if (error) console.log(error.message);
    return await fileContent;
  });
}
async function getComponents() {
  const dirents = await fsPromises.readdir(path.join(__dirname, 'components'));
  const direntsContent = [];
  for (let dirent of dirents) {
    const {name} = path.parse(path.join(__dirname, 'components', dirent));
    const content = await getContent(path.join(__dirname, 'components', dirent));
    const obj = {
      name,
      content
    };
    direntsContent.push(obj);
  }
  return direntsContent;
}

const mergeHtml = async ()=> {
  const componentsContent = await getComponents();
  let newFile = await getContent(path.join(__dirname, 'template.html'));
  for (let component of componentsContent) {
    newFile = newFile.replace(`{{${component.name}}}`, `\n ${component.content} \n`);
    
  }
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
  fs.writeFile((path.join(__dirname, 'project-dist', 'index.html')), newFile, (err) => {
    if (err) return console.log(err.message);
  });
};

async function mergeStyles () {
  const dirents = await fs.promises.readdir(path.join(__dirname, 'styles'));
  const styleDirents = dirents.filter(dirent => 
    ( path.parse( path.join( __dirname, 'styles', dirent ) ) ).ext === '.css');
  const writeStream = fs.createWriteStream(path.join( __dirname, 'project-dist', 'style.css' ), 'utf-8');
  styleDirents.forEach(async (dirent) => {
    const readStream = fs.createReadStream(path.join( __dirname, 'styles', dirent ));
    readStream.pipe(writeStream);
  });
  
}
async function deleteDirectory(pathToDir) {
  try {
    const dirents = await fsPromises.readdir(pathToDir, {withFileTypes: true});
    if (dirents.length > 0) {
      for (const dirent of dirents) {
        if (dirent.isDirectory()){
          await deleteDirectory(path.join(pathToDir, dirent.name));
        } else {
          await fsPromises.rm(path.join(pathToDir, dirent.name), { recursive:true, force: true  }, err => {
            if (err) {console.log(err.message);}
          });
        }
      }
    } 
    await fsPromises.rm(pathToDir, { recursive:true, force: true  }, err => {
      if (err) {console.log(err.message);}
    });
  } catch (error) {
    return;
  }
  
  
  
}


async function copyDirFiles (initialPath, destinationPath) {
  
  try {
    
    await fsPromises.mkdir(destinationPath, {recursive: true});
    const dirents = await fsPromises.readdir(initialPath, {withFileTypes: true});
    let direntNames = [];
    for (const dirent of dirents) {
      if (dirent.isFile()) {
        direntNames.push(dirent.name);
        const rs = fs.createReadStream(path.join(initialPath, dirent.name));
        const ws = fs.createWriteStream(path.join(destinationPath, dirent.name));
        rs.pipe(ws);
      } else {
        const sourcePath = path.join(initialPath, dirent.name);
        const destPath = path.join(destinationPath, dirent.name);
        copyDirFiles (sourcePath, destPath);
      }
    }
  } catch (err) {
    console.error('from copydir', err.message);
  }
}
try {
  
  (async () => {
    await mergeHtml();
    const destinationPath = path.join(__dirname, 'project-dist', 'assets');
    const sourcePath = path.join(__dirname, 'assets');
    fs.access(destinationPath, async function(error) {
      if (!error) {
        await deleteDirectory(destinationPath);
        await mergeStyles();
        await copyDirFiles(sourcePath, destinationPath);
      } else {
        await mergeStyles();
        await copyDirFiles(sourcePath, destinationPath);
      }
    });
  })();
} catch (error) {
  console.error(error);
}
