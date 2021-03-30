const {
    Chanel
} = require('../../models');

const checkAuth = async (req, res) => {

    try {
        const { id } = req.user;

        const user = await Chanel.findOne({
            where: {
                id
            }
        });
    
        if(!user){
            return res.send({
                status: "error",
                error: {
                    message: "Invalid user"
                }
            });
        }
    
        res.send({
            status: "success",
            data: {
                user
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


exports.checkAuth = checkAuth;