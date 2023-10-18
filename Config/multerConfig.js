const multer = require('multer');


const multerConfig= multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/depositProofs')
    },
    filename: (req, file, cb) =>{ 
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const uploadMod = multer({storage: multerConfig});
module.exports = {multerConfig, uploadMod};