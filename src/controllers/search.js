const {Op} = require('sequelize');
const {
    Video
} = require('../../models');

const search = async (req, res) => {
    try {

        const { keyword, offset, limit } = req.body;
        console.log(req.body);

        const videos = await Video.findAll({
            where:{
                [Op.or]:[
                    {
                        "title":{[Op.like]:`%${keyword}%`}
                    }
                ]
            },
            offset,
            limit
        });


        res.send({
            status:"success",
            data: {
                videos
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

exports.search = search;