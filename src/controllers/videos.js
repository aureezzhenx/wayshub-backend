const {
    Video,
    Chanel,
    Comment
} = require('../../models');

const Joi = require('joi');
const { moveFile, deleteFile } = require('../helper/file');
const { cloudinary } = require('../../config/cloudinary');

const getVideos = async (req, res) => {
    try {

        const {offset, limit} = req.params;

        const videos = await Video.findAll({
            subQuery:false,
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [
                ['id', 'DESC'],
            ],
            attributes: {
                exclude:['updatedAt','chanelId', 'chanelid', 'ChanelId']
            },
            include: {
                model: Chanel,
                as: 'chanel',
                attributes:{
                    exclude:['updatedAt', 'createdAt', 'password']
                }
            },
            
            
        });

        if(!videos){
            res.send({
                status: "error",
                error: {
                    message: "data not found"
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

const getVideoById = async (req, res) => {
    try {
        const {id} = req.params;
        const video = await Video.findOne({
            where: {
                id
            },
            attributes:{
                exclude:['updatedAt','chanelId', 'ChanelId'],
            },
            include: [
                {
                    model: Chanel,
                    as:'chanel',
                    attributes:{
                        exclude:['updatedAt', 'createdAt', 'password']
                    }
                },
                {
                    model:Comment,
                    as:"comments",
                    attributes:{
                        exclude:['chanelid', 'videoid', 'updatedAt', 'createdAt', 'ChanelId', 'VideoId', 'chanelId']
                    },
                    include: {
                        model: Chanel,
                        as:'chanel',
                        attributes:{
                            exclude:['updatedAt', 'createdAt', 'password']
                        }
                    }
                }
            ]

        });

        if(!video){
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
                video
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

const addVideo = async (req, res) => {
    try {
        const { id } = req.user;

        const { body, files } = req;
        const thumbnailFile = (files.thumbnail) ? files.thumbnail[0] : null;
        const videoFile = (files.video) ? files.video[0] : null;

        console.log(thumbnailFile)

        if(!id){
            return res.send({
                status: 'error',
                error: {
                    message: "invalid user"
                }
            });
        }

        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
        });

        const { error } = schema.validate(body);

        if(error){
            if(thumbnailFile){
                cloudinary.uploader.destroy(thumbnailFile.filename, (error, result)=>{
                    console.log(error, result)
                })
            }

            if(videoFile){
                cloudinary.uploader.destroy(videoFile.filename, {resource_type: 'video'}, (error, result)=>{
                    console.log(error, result)
                })
                
            }
            return res.send({
                status: 'error',
                error: {
                    message: error.message
                }
            });
        }

        if(!thumbnailFile){
            if(videoFile){
                cloudinary.uploader.destroy(videoFile.filename, {resource_type: 'video'}, (error, result)=>{
                    console.log(error, result)
                })
                
            }
            return res.send({
                status: 'error',
                error: {
                    message: "Please select thumbnail"
                }
            });
        }

        if(!videoFile){
            if(thumbnailFile){
                cloudinary.uploader.destroy(thumbnailFile.filename, (error, result)=>{
                    console.log(error, result)
                })
            }
            return res.send({
                status: 'error',
                error: {
                    message: "Please select video"
                }
            });
        }

        const thumbnailUpload = {
            path: thumbnailFile.path,
            filename: thumbnailFile.filename
        }

        const videoUpload = {
            path: videoFile.path,
            filename: videoFile.filename
        }

        const postVideo = await Video.create(
            {
                ...body,
                chanelId: id,
                thumbnail: JSON.stringify(thumbnailUpload),
                video: JSON.stringify(videoUpload),
                viewCount: 0
            }
            
        );

        const video = await Video.findOne({
            where: {
                id: postVideo.id
            },
            attributes:{
                exclude:['updatedAt','chanelId', 'chanelid', 'ChanelId'],
            },
            include: [
                {
                    model: Chanel,
                    as:'chanel',
                    attributes:{
                        exclude:['updatedAt', 'createdAt', 'password', 'id']
                    }
                },
                {
                    model:Comment,
                    as:"comments",
                    attributes:{
                        exclude:['chanelid', 'videoid', 'updatedAt', 'createdAt', 'ChanelId', 'VideoId', 'chanelId']
                    },
                    include: {
                        model: Chanel,
                        as:'chanel',
                        attributes:{
                            exclude:['updatedAt', 'createdAt', 'password']
                        }
                    }
                }
            ]

        });

        return res.send({
            status: "success",
            data: {
                video
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


const editVideo = async (req, res) => {
    try {
        const currentUserLoginId = req.user.id;
        const { videoId } = req.params;

        const videoDb = await Video.findOne({
            where: {
                id: videoId,
                chanelId: currentUserLoginId
            }
        });

        const thumbnailDbName = (videoDb) ? videoDb.thumbnail:null;
        const videoDbName = (videoDb)? videoDb.video:null;

        const { body, files } = req;
        const thumbnailName = (files.thumbnail) ? files.thumbnail[0].filename : thumbnailDbName
        const videoName = (files.video) ? files.video[0].filename : videoDbName;

        if(!videoDb){
            deleteFile('tmp/thumbnail', thumbnailName);
            deleteFile('tmp/video', videoName);
            return res.send({
                status: "error",
                error: {
                    message: "Resource not found"
                }
            });
        }

        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
        });

        const { error } = schema.validate(body);

        if(error){
            deleteFile('tmp/thumbnail', thumbnailName);
            deleteFile('tmp/video', videoName);
            return res.send({
                status: 'error',
                error: {
                    message: error.message
                }
            });
        }

        await Video.update({
            ...body,
            thumbnail: thumbnailName,
            video: videoName,
        }, {
            where: {
                id: videoId
            }
        });

        const video = await Video.findOne({
            where: {
                id: videoId
            },
            attributes:{
                exclude:['updatedAt','chanelId', 'chanelid', 'ChanelId'],
            },
            include: [
                {
                    model: Chanel,
                    as:'chanel',
                    attributes:{
                        exclude:['updatedAt', 'createdAt', 'password', 'id']
                    }
                },
                {
                    model:Comment,
                    as:"comments",
                    attributes:{
                        exclude:['chanelid', 'videoid', 'updatedAt', 'createdAt', 'ChanelId', 'VideoId', 'chanelId']
                    },
                    include: {
                        model: Chanel,
                        as:'chanel',
                        attributes:{
                            exclude:['updatedAt', 'createdAt', 'password']
                        }
                    }
                }
            ]

        });

        moveFile('thumbnail', video.thumbnail);
        moveFile('video', video.video);
        
        if(video.thumbnail !== videoDb.thumbnail){
            deleteFile('thumbnail', videoDb.thumbnail);
        }

        if(video.video !== videoDb.video){
            deleteFile('video', videoDb.video);
        }

        
        return res.send({
            status: "success",
            data: {
                video
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

const deleteVideo = async (req, res) => {
    try {

        const currentUserLoginId = req.user.id;
        const { videoId } = req.params;

        const videoDb = await Video.findOne({
            where: {
                id: videoId,
                chanelId: currentUserLoginId
            }
        });

        if(!videoDb){
            return res.send({
                status: "error",
                error: {
                    message: "Resource not found"
                }
            });
        }

        await Comment.destroy({
            where: {
                videoId
            }
        });

        await Video.destroy({
            where: {
                id: videoId
            }
        });

        const thumbnailFile = JSON.parse(videoDb.thumbnail);
        const videoFile = JSON.parse(videoDb.video);

        cloudinary.uploader.destroy(thumbnailFile.filename, (error, result)=>{
            console.log(error, result)
        })

        cloudinary.uploader.destroy(videoFile.filename, {resource_type: 'video'}, (error, result)=>{
            console.log(error, result)
        })

        return res.send({
            status: "success",
            data: {
                id: videoId
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



exports.getVideos = getVideos;
exports.getVideoById = getVideoById;
exports.addVideo = addVideo;
exports.editVideo = editVideo;
exports.deleteVideo = deleteVideo;