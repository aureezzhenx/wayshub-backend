const {
    Video,
    Chanel,
    Comment,
    LikeVideo
} = require('../../models');

const checkLike = async (req,res) => {
    try {

        const {id} = req.user;
        const {videoId} = req.params;

        const response = await LikeVideo.findOne({
            where: {
                chanelId: parseInt(id),
                videoId: parseInt(videoId)
            }
        });

        const countLikes = await LikeVideo.findAll({
            where:{
                videoId: parseInt(videoId)
            }
        });

        if(!response){
            return res.send({
                status: "success",
                data: {
                    isLiked: false,
                    countLikes: countLikes.length
                }
            })
        }

        res.send({
            status: "success",
            data: {
                isLiked: true,
                countLikes: countLikes.length
            }
        });

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            error: {
                message: "Server Error"
            }
        })
    }
}

const addLike = async (req,res) => {
    try{
        const {id} = req.user;
        const { videoId } = req.body;

        const checkLike = await LikeVideo.findOne({
            where: {
                chanelId: parseInt(id),
                videoId: parseInt(videoId)
            }
        });

        if(checkLike){
            return res.send({
                status: "error",
                error: {
                    message: "Already liked this video"
                }
            })
        }

        if(!videoId){
            return res.send({
                status: "error",
                error: {
                    message: "VideoId is required"
                }
            })
        }

        const likeVideo = await LikeVideo.create({
            chanelId: parseInt(id),
            videoId: parseInt(videoId)
        });

        res.send({
            status: "success",
            data: {
                likeVideo
            }
        })

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            error:{
                message: "Server Error"
            }
        })
    }
}

const unlike = async (req, res) => {
    try {

        const { id } = req.user;
        const { videoId } = req.params;

        const response = await LikeVideo.findOne({
            where: {
                chanelId: parseInt(id),
                videoId: parseInt(videoId)
            }
        });

        if(!response){
            return res.send({
                status: "error",
                error: {
                    message: "Resource not found"
                }
            })
        }

        await response.destroy();

        res.send({
            status: "success",
            data: {
                id: videoId
            }
        })

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            error: {
                message: "Server Error"
            }
        })
    }
}

exports.checkLike = checkLike;
exports.addLike = addLike;
exports.unlike = unlike;