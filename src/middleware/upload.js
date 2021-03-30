const multer = require('multer');

const upload = (fields) => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            switch(file.fieldname){
                case "thumbnail":
                    cb(null, 'uploads/tmp/thumbnail');
                    break;
                case "photo":
                    cb(null, 'uploads/tmp/photo');
                    break;
                case "video":
                    cb(null, 'uploads/tmp/video');
                    break;
                default:
                    break;
            }
            
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });

    

    const fileFilter = (req, file, cb) => {
        
        if(file.fieldname === "thumbnail" || file.fieldname === "photo"){
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                req.fileValidationError = {
                  message: "Only image files are allowed!",
                };
                return cb(new Error("Only image files are allowed!"), false);
            }
        }

        if (file.fieldname === "video") {
            if (!file.originalname.match(/\.(mp4|webm)$/)) {
              req.fileValidationError = {
                message: "Only Video files are allowed!",
              };
              return cb(new Error("Only Video files are allowed!"), false);
            }
        }

        cb(null, true);
    }


    const maxSixe = 200 * 1000 * 1000;

    const doUpload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSixe
        },
    }).fields(
        fields.map(item => {
            return {
                name: item
            }
        })
    );


    return (req, res, next) => {
        
        doUpload(req, res, (err) => {
            if(req.fileValidationError){
                const message = req.fileValidationError.message;
                return res.send({
                    status: "error",
                    error: {
                        message
                    }
                    
                });
            }

            if(!req.files && !err){
                return res.send({
                    status: 'error',
                    message: "Please select file to upload"
                });
            }

            if (err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.send({
                        status: "error",
                        message: "Max file sized 10MB",
                    });
                }
                return res.send({
                    status: "error",
                    message: err
                });
            }

            return next();
        });
    }
}

exports.upload = upload;