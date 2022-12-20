const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        let fileExtension;
        switch(file.mimetype) {
            case 'image/png':
                fileExtension = '.png';
                break;
            case 'image/jpeg':
                fileExtension = '.jpeg';
                break;
        }
        let fileName = new Date().toISOString();
        target = new RegExp(/\.|:|-/, 'g'); //removes '.' OR '-' OR ':'
        fileName = fileName.replace(target, '') + fileExtension;
        cb(null, fileName);
    }
});

const filter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }  
}

module.exports = multer({storage: storage, fileFilter: filter}).single('image');