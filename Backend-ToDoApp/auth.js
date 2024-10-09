const jwt = require('jsonwebtoken');
const JWT_SECRET = "MY_SECRET_KEY";

function auth(req, res, next) {
    const token = req.headers.authorization;

    jwt.verify(token, JWT_SECRET, (err, response) => {
        if(err) {
            return res.status(401).json({
                message: "Invalid token"
            })
        }
        req.userId = response.userId;
        next();
    })
}

module.exports = {
    auth,
    JWT_SECRET
}