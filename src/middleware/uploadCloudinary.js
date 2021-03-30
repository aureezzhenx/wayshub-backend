const multer = require('multer');

const {cloudinary} = require('../../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const uploadCloudinary = (fields) => {

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req,file) => {
            return {
                folder: `${file.fieldname}`,
                resource_type: (file.fieldname === "video")? 'video': 'image',
                public_id: `${Date.now()}-${file.originalname}`
            }
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

    const maxSixe = 100 * 1024 * 1024;

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
                    error: {
                        message: "Please select file to upload"
                    }
                });
            }

            if (err) {
                console.log(err);
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.send({
                        status: "error",
                        error:{
                            message: "Max file sized 100MB",
                        }
                    });
                }
                return res.send({
                    status: "error",
                    error: {
                        message: err.message
                    }
                });
            }

            return next();
        });
    }
}

exports.uploadCloudinary = uploadCloudinary;