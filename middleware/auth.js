const Jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
    let token = req.header("x-auth-token");
    if(!token) return res.status(401).send("Access denied. No token provided");

    try {
        const decoded = Jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("invalid token");
    }

}