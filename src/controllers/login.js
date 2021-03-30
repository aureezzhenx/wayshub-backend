const { Chanel } = require('../../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { body } = req;

        const schema = Joi.object({
            email: Joi.string().email().required(),
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

        const user = await Chanel.findOne({
            where: {
                email: body.email
            }
        });


        if(!user){
            return res.send({
                status: 'error',
                error: {
                    message: "Invalid login"
                }
            });
        }


        const { email, password } = body;
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.send({
                status: 'error',
                error: {
                    message: "Invalid login"
                }
            });
        }

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

        });

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


exports.login = login;