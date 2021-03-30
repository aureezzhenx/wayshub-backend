const {
    Video,
    Chanel,
    Comment
} = require('../../models');

const Joi = require('joi');

const getCommentsByVideo = async (req, res) => {
   
    try {

        const {videoId} = req.params;

        const videoById = await Video.findOne({
            where: {
                id: videoId
            }
        });

        if(!videoById){
            return res.send({
                status: "error",
                error: {
                    message: "Resource not found"
                }
               
            });
        }

        const comments = await Comment.findAll({
            where: {
                videoId
            },
            attributes:{
                exclude:['updatedAt','chanelId', 'chanelid', 'ChanelId', 'videoId', 'VideoId'],
            },
            include: [
                {
                    model: Chanel,
                    as:'chanel',
                    attributes:{
                        exclude:['updatedAt', 'createdAt', 'password']
                    }
                }
            ]

        });

        res.send({
            status: "success",
            data : {
                comments
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

const getDetailComment = async (req, res) => {
    try {
         const {videoId, commentId} = req.params;
         const comment = await Comment.findOne({
             where: {
                 id: commentId,
                 videoId
             },
             attributes:{
                 exclude:['updatedAt','chanelId', 'chanelid', 'ChanelId', 'videoid', 'createdAt', 'videoId', 'VideoId']
             },
             include: {
                 model:Chanel,
                 as:'chanel',
                 attributes:{
                     exclude:['updatedAt', 'createdAt', 'password']
                 }
             }
         });

         if(!comment){
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
                 comment
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

 const addComment = async (req, res) => {
     try {

        const { id } = req.user;
        const { videoId } = req.params;
        const { body } = req;

        const videoById = await Video.findOne({
            where: {
                id: videoId
            }
        });


        if(!videoById){
            return res.send({
                status:"error",
                error: {
                    message: "Resource not found"
                }
                
            });
        }

        const schema = Joi.object({
            comment: Joi.string().required()
        });

        const { error } = schema.validate(body);

        if(error){
            return res.send({
                status: 'error',
                error: {
                    message: error.message
                }
            });
        }

        const addComment = await Comment.create({
            ...body,
            chanelId: id,
            videoId
        });

        const comment = await Comment.findOne({
            where: {
                id: addComment.id
            },
            attributes:{
                exclude:['updatedAt','chanelId', 'chanelid', 'ChanelId', 'videoid', 'createdAt', 'videoId', 'VideoId']
            },

            include: {
                model:Chanel,
                as:'chanel',
                attributes:{
                    exclude:['updatedAt', 'createdAt', 'password']
                }
            }
        });
        

        res.send({
            status: 'success',
            data: {
                comment
            }
        })

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

 const editComment = async (req, res) => {
    try {
        const { id } = req.user;
        const { videoId, commentId } = req.params;
        const { body } = req;

        const commentById = await Comment.findOne({
            where: {
                id: commentId,
                chanelId: id,
                videoId
            }
        });

        if(!commentById){
            return res.send({
                status:"error",
                error: {
                    message: "Resource not found"
                }
            })
        }

        const schema = Joi.object({
            comment: Joi.string().required()
        });

        const { error } = schema.validate(body);

        if(error){
            return res.send({
                status: 'error',
                error: {
                    message: error.message
                }
            });
        }

        await Comment.update(
            {
                ...body
            },
            {
                where: {
                    id: commentId
                }
            }
        );

        const comment = await Comment.findOne({
            where: {
                id: commentId
            },
            attributes:{
                exclude:['updatedAt','chanelId', 'chanelid', 'ChanelId', 'videoid', 'createdAt', 'videoId', 'VideoId']
            },

            include: {
                model:Chanel,
                as:'chanel',
                attributes:{
                    exclude:['updatedAt', 'createdAt', 'password']
                }
            }
        });

        res.send({
            status:"success",
            data: {
                comment
            }
        })

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


 const deleteComment = async (req, res) => {
     try {
        const { id } = req.user;
        const { videoId, commentId } = req.params;

        const commentById = await Comment.findOne({
            where: {
                id: commentId,
                chanelId: id,
                videoId
            }
        });

        if(!commentById){
            return res.send({
                status:"error",
                error: {
                    message: "Resource not found"
                }
            })
        }

        commentById.destroy();

        res.send({
            status: "success",
            id:commentId
        })

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

exports.getCommentsByVideo = getCommentsByVideo;
exports.getDetailComment = getDetailComment;
exports.addComment = addComment;
exports.editComment = editComment;
exports.deleteComment = deleteComment;