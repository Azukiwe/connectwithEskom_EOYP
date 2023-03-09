require('dotenv').config();
const {sign, verify} = require('jsonwebtoken');
//CREATING A TOKEN
function createToken(user) {
    return sign({
        emailAdd: user.emailAdd,
        userPass:user.userPass
    },
    process.env.SECRET_kEY,
    {
        expiresIn:'1h'
    });
}
//VERIFYING A TOKEN
function verifyToken(req, res, next) {
    try{
        const token = req.cookies["RealUser"] !== null ? req.cookies["RealUser"] : "Register Please";
        const isValidated = null;
        if(token !== "Register Please") {
            isValidated = verify(token, process.env.SECRET_KEY);
            if(isValidated) {
            req.authenticated = true;
            next();
        }else {
            res.status(400).json({err: "Register Please"})
        }
    }else {
        res.status(400).json({err: u.message});
    }
    }catch(u){
    res.status(400).json({err: u.message});
    }
}
module.exports = {createToken, verifyToken};