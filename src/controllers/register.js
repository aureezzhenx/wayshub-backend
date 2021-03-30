const { Chanel } = require('../../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {cloudinary} = require('../../config/cloudinary');

const register = async (req, res) => {
    try {
        const { body } = req;

        const photo = await cloudinary.api.resource('/photo/default_photo',{resource_type:'image'}, (error, result)=>{
            if(error){
                return res.status(500).send({
                    status: 'error',
                    error: {
                      message: "Server Error",
                    }
                });
            }
        });

        const cover = await cloudinary.api.resource('/cover/default_cover',{resource_type:'image'}, (error, result)=>{
            if(error){
                return res.status(500).send({
                    status: 'error',
                    error: {
                      message: "Server Error",
                    }
                });
            }
        });

        const photoFile = {
            path: photo.secure_url,
            filename: photo.public_id
        }

        const coverFile = {
            path: cover.secure_url,
            filename: cover.public_id
        }

        console.log(photo);

        const schema = Joi.object({
            email: Joi.string().email().required(),
            chanelName: Joi.string().required(),
            description: Joi.string().required(),
            password: Joi.string().required()
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

        if(checkEmail){
            return res.send({
                status: 'error',
                error: {
                    message: "Email is already registered"
                }
            });
        }

        if(checkChanelName){
            return res.send({
                status: 'error',
                error: {
                    message: "Chanel name is already registered"
                }
            });
        }

        const { email, chanelName, description, password } = body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Chanel.create({
            email,
            chanelName,
            description,
            cover: JSON.stringify(coverFile),
            photo: JSON.stringify(photoFile),
            password: hashedPassword
        });

        const privateKey = process.env.JWT_PRIVATE_KEY;
        const token = jwt.sign(
            {
                id: user.id
            },
            privateKey
        );

        res.send({
            status: 'success',
            data: {
                chanel: {
                    email: user.email,
                    token
                }
            }

        })

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: 'error',
            error: {
              message: "Server Error",
            }
        });
    }

}


exports.register = register;