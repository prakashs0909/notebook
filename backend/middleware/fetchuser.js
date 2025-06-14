const jwt = require("jsonwebtoken");
const JWT_SECRET = "goodboy";

const fetchuser = (req, res, next)=>{
    // get the user from jwt token
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({error: "use valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "use valid token"})
    }
    
}

module.exports = fetchuser;