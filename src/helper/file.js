const fs = require('fs');
const path  = require('path');

const moveFile = (dest, fileName) => {
    const destinationPath = path.resolve(__dirname, `../../uploads/tmp/${dest}/`);
    const newDestionation = path.resolve(__dirname, `../../uploads/${dest}/`)
   
    fs.readdir(destinationPath, (err, files) => {
        files.forEach(file => {
           if(file === fileName){
               fs.rename(`${destinationPath}/${file}`, `${newDestionation}/${fileName}`, (err) => {
                   if(err){
                       console.log(err);
                       return;
                   }
                   console.log('move file');
               })
           }
        });
    });
}

const deleteFile = (dest, fileName) => {
    const destinationPath = path.resolve(__dirname, '../../uploads/');

    if(fileName === "default.jpg" && dest === "photo"){
        console.log(true);
        return;
    }

    if(fileName === "default.jpg" && dest === "thumbnail"){
        console.log(true);
        return;
    }

    if(fs.existsSync(`${destinationPath}/${dest}/${fileName}`)){
        fs.unlink(`${destinationPath}/${dest}/${fileName}`, (err) => {
            if(err) {
                console.log(err);
                return;
            }
    
            console.log("delete file");
        })
    } else {
        return;
    }

    
}

exports.moveFile = moveFile;
exports.deleteFile = deleteFile;