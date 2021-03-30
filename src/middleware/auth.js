const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    let header, token;

    if(
        !(header = req.header('Authorization')) ||
        !(token = header.replace('Bearer ', ''))
    ) {
        return res.status(400).send({
            status: 'error',
            error: {
                message: "Access Denied"
            }
        });
    }

    try {
        const privateKey = process.env.JWT_PRIVATE_KEY;
        const verified = jwt.verify(token, privateKey);

        req.user = verified;
        next();

    } catch(err){
        console.log(err);
        return res.status(400).send({
            status: 'error',
            error: {
                message: "Invalid token"
            }
        });
    }
}

exports.auth = auth