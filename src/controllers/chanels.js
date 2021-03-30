const {
    Chanel,
    Subscribe,
    Video,
    Comment
} = require('../../models');

const Joi = require('joi');
const bcrypt = require('bcrypt');
const { cloudinary } = require('../../config/cloudinary');

const getChanels = async (req, res) => {
    try {
        const chanels = await Chanel.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            },
            include: {
                model: Chanel,
                as: 'subscribers',
                through: {
                    attributes : []
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                }
            }
        });

        res.send({
            status: "success",
            data : {
                chanels
            }
        });
    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            error: {
                message: "server error"
            }
        });
    }
}

const getChanelById = async (req, res) => {
    try {
        const {id} = req.params;
        const chanel = await Chanel.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            },
            include: {
                model: Chanel,
                as: 'subscribers',
                through: {
                    attributes : []
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                }
            }
        });

        if(!chanel){
            return res.send({
                status: 'error',
                error: {
                    message: "Chanel not found"
                }
            });
        }

        res.send({
            status: "success",
            data : {
                chanel
            }
        });
    } catch(err) {
        console.log(err);
        return res.status(500).send({
            status: "error",
            error: {
                message: "server error"
            }
        });
    }
}

const getVideosByChanelId = async (req, res) => {
    try {
        const {id} = req.params;
        const videos = await Video.findAll({
            where: {
                chanelId: id
            },
            attributes:{
                exclude:['updatedAt','chanelId', 'chanelid', 'ChanelId'],
            },
            include:{
                model: Chanel,
                as: 'chanel'
            }

        });

        if(!videos){
            return res.send({
                status: "error",
                error: {
                    message: "Resource not found"
                }
            });
        }

        res.send({
            status: "success",
            data : {
                videos
            }
        });

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            error: {
                message: "server error"
            }
        });
    }
}

const editChanel = async (req, res) => {
    
    try {

        const currentUserLoginId = req.user.id;
        const { id } = req.params;

        const chanelDb = await Chanel.findOne({
            where: {
                id
            }
        });

        const { body } = req;
        const coverFile = (req.files.cover) ? req.files.cover[0] : JSON.parse(chanelDb.cover);
        const photoFile = (req.files.photo) ? req.files.photo[0] : JSON.parse(chanelDb.photo);

        if(currentUserLoginId != id){
            if(coverFile.encoding){
                if(coverFile.filename !== 'cover/default_cover'){
                    cloudinary.uploader.destroy(coverFile.filename, (error, result)=>{
                        console.log(error, result)
                    })
                }
            }

            if(photoFile.encoding){
                if(photoFile.filename !== 'photo/default_photo'){
                    cloudinary.uploader.destroy(photoFile.filename, (error, result)=>{
                        console.log(error, result)
                    })
                }
            }
            return res.status(400).send({
                status: "error",
                error: {
                    message: "Invalid user"
                }
                
            });
        }

        const schema = Joi.object({
            email: Joi.string().email().required(),
            chanelName: Joi.string().required(),
            description: Joi.string().required(),
            password: Joi.string().required()
        });


        const { error } = schema.validate(body);

        const checkEmail = await Chanel.findOne({
            where: {
                email: body.email
            }
        });

        const checkChanelName = await Chanel.findOne({
            where: {
                chanelName: body.chanelName
            }
        });

        if(error){
            if(coverFile.encoding){
                if(coverFile.filename !== 'cover/default_cover'){
                    cloudinary.uploader.destroy(coverFile.filename, (error, result)=>{
                        console.log(error, result)
                    })
                }
            }

            if(photoFile.encoding){
                if(photoFile.filename !== 'photo/default_photo'){
                    cloudinary.uploader.destroy(photoFile.filename, (error, result)=>{
                        console.log(error, result)
                    })
                }
            }
            return res.send({
                status: 'error',
                error: {
                    message: error.message
                }
            });
        }

        if(checkEmail && body.email !== chanelDb.email){
            if(coverFile.encoding){
                if(coverFile.filename !== 'cover/default_cover'){
                    cloudinary.uploader.destroy(coverFile.filename, (error, result)=>{
                        console.log(error, result)
                    })
                }
            }

            if(photoFile.encoding){
                if(photoFile.filename !== 'photo/default_photo'){
                    cloudinary.uploader.destroy(photoFile.filename, (error, result)=>{
                        console.log(error, result)
                    })
                }
            }
            return res.send({
                status: 'error',
                error: {
                    message: "email is already registered"
                }
            });
        }


        if(checkChanelName && body.chanelName !== chanelDb.chanelName){
            if(coverFile.encoding){
                if(coverFile.filename !== 'cover/default_cover'){
                    cloudinary.uploader.destroy(coverFile.filename, (error, result)=>{
                        console.log(error, result)
                    })
                }
            }

            if(photoFile.encoding){
                if(photoFile.filename !== 'photo/default_photo'){
                    cloudinary.uploader.destroy(photoFile.filename, (error, result)=>{
                        console.log(error, result)
                    })
                }
            }
            return res.send({
                status: 'error',
                error: {
                    message: "chanel name is already registered"
                }
            });
        }

        const coverUpload = {
            path: coverFile.path,
            filename: coverFile.filename
        }

        const photoUpload = {
            path: photoFile.path,
            filename: photoFile.filename
        }


        await Chanel.update({
            ...body,
            password: chanelDb.password,
            cover: JSON.stringify(coverUpload),
            photo: JSON.stringify(photoUpload)
        }, {
            where: {
                id
            }
        });

        const chanel = await Chanel.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'id']
            },
            where: {
                id
            }
        });

        
        
        if(coverFile.encoding){
            if(JSON.parse(chanelDb.cover).filename !== 'cover/default_cover'){
                cloudinary.uploader.destroy(JSON.parse(chanelDb.cover).filename, (error, result)=>{
                    console.log(error, result)
                })
            }
        }

        if(photoFile.encoding){
            if(JSON.parse(chanelDb.photo).filename !== 'photo/default_photo'){
                cloudinary.uploader.destroy(JSON.parse(chanelDb.photo).filename, (error, result)=>{
                    console.log(error, result)
                })
            }
        }
        
        return res.send({
            status: "success",
            data: {
                chanel
            }
        });

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            error: {
                message: "server error"
            }
        });
    }
}

const deleteChanel = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserLoginId = req.user.id;

        if(currentUserLoginId != id){
            return res.status(400).send({
                status: "error",
                messages: "Invalid user"
            });
        }

        const chanelById = await Chanel.findOne({
            where: {
                id
            }
        });

        const video = await Video.findAll({
            where: {
                chanelId: id
            }
        });

        const videoId = [];

        video.forEach(item => {
            videoId.push(item.id);
        });

        if(!chanelById){
            return res.send({
                status: 'error',
                error: {
                    message: `Chanel with id : ${id} not found`
                }
            });
        }

        deleteFile('photo', chanelById.photo);
        deleteFile('thumbnail', chanelById.thumbnail);

        await Subscribe.destroy({
            where: {
                subscriberId: id
            }
        });

        await Subscribe.destroy({
            where: {
                chanelId: id
            }
        });

        await Comment.destroy({
            where: {
                id: videoId
            }
        });

        await Comment.destroy({
            where: {
                chanelId: id
            }
        })

        await Video.destroy({
            where: {
                chanelId: id
            }
        })

        await Chanel.destroy({
            where: {
                id
            }
        })
        
        return res.send({
            status: "success",
            data: {
                id
            }
        });

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            error: {
                message: "server error"
            }
        });
    }
}

exports.getChanels = getChanels;
exports.getChanelById = getChanelById;
exports.getVideosByChanelId = getVideosByChanelId;
exports.editChanel = editChanel;
exports.deleteChanel = deleteChanel;