const {
    Chanel,
    Subscribe,
    Video,
    Comment,
    sequelize
} = require('../../models');

const { QueryTypes } = require('sequelize');
const {Op} = require('sequelize');

const Joi = require('joi');

const addSubscribe = async (req, res) => {
    try {
        const { id } = req.user;
        const { body } = req;

        const isChanelExist = await Chanel.findOne({
            where : {
                id: body.chanelId
            }
        });

        console.log(isChanelExist);

        if(id === body.chanelId){
            return res.send({
                status: 'error',
                error: {
                    message: "Cannot subscribe"
                }
            });
        }

        if(!isChanelExist){
            return res.send({
                status: 'error',
                error: {
                    message: "chanel not exist"
                }
            });
        }

        const isSubscribed = await Subscribe.findOne({
            where: {
                chanelId: body.chanelId,
                subscriberId: id
            }
        });

        const schema = Joi.object({
            chanelId: Joi.number().integer().required()
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

        if(isSubscribed){
            return res.send({
                status: 'error',
                error: {
                    message: "Already subscribe to this chanel"
                }
            });
        }

        await Subscribe.create({
            ...body,
            subscriberId: id
        });

        const chanel = await Chanel.findOne({
            where: {
                id: body.chanelId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        res.send({
            status: "success",
            data: {
                subscribe: {
                    chanel
                }
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

const unSubscribe = async (req, res) => {
    try {
        const { id:subscriberId } = req.user;
        const { chanelId } = req.params;

        const isSubscribed = await Subscribe.findOne({
            where: {
                chanelId,
                subscriberId
            }
        });

        if(!isSubscribed){
            return res.send({
                status: 'error',
                error: {
                    message: "Resource not found"
                }
            });
        }

        isSubscribed.destroy();

        res.send({
            status: "success",
            data: {
                id: chanelId
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

const getSubscribtion = async (req, res) => {
    try {
        const { id } = req.user;

        const subscribtion = await Chanel.findOne({
            where:{
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'chanelName', 'cover', 'description', 'email', 'id', 'photo']
            },
            include: {
                model: Chanel,
                as: 'subscribtion',
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
                subscribtion: subscribtion.subscribtion
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

const getVideosSubscribtion = async (req, res) => {
    try {
        const { id } = req.user;

        const subscribtions = await Subscribe.findAll({
            where: {
                subscriberId : id
            }
        });

        const subscribtionsChanelId = [];

        subscribtions.map((subscribtion) => {
            subscribtionsChanelId.push(subscribtion.chanelId)
        });

        if(subscribtionsChanelId.length === 0 ){
            return res.send({
                status: 'error',
                error: {
                    message: "Resource not found"
                }
            });
        }

        const videos = await Video.findAll({
            where: {
                "$chanel.id$":[subscribtionsChanelId]
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'chanelId', 'ChanelId']
            },
            include: {
                model: Chanel,
                as:'chanel',
                attributes: {
                    exclude:['password', 'createdAt', 'updatedAt']
                }
            }
        })
        

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

const checkSubscribe = async (req, res) => {
    try {
        const { id } = req.user;
        const { body } = req;

        const isChanelExist = await Chanel.findOne({
            where : {
                id: body.chanelId
            }
        });

        if(id === body.chanelId){
            return res.send({
                status: 'error',
                error: {
                    message: "Cannot subscribe"
                }
            });
        }

        if(!isChanelExist){
            return res.send({
                status: 'error',
                error: {
                    message: "chanel not exist"
                }
            });
        }

        const isSubscribed = await Subscribe.findOne({
            where: {
                chanelId: body.chanelId,
                subscriberId: id
            }
        });

        if(!isSubscribed){
            return res.send({
                status: 'error',
                error: {
                    message: "resource not found"
                }
            });
        }

        res.send({
            status: "success",
            data: {
                subscribe: isSubscribed
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

exports.addSubscribe = addSubscribe;
exports.unSubscribe = unSubscribe;
exports.getSubscribtion = getSubscribtion;
exports.getVideosSubscribtion = getVideosSubscribtion;
exports.checkSubscribe = checkSubscribe;