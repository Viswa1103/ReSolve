const jwt =require("jsonwebtoken")
require("dotenv").config()

function requireAuth(req,res,next){

    const header = req.headers.authorization

    if(!header){
        return res.status(401).json({Erro: "Not logged in"})
    }
    const token = header.replace("Bearer ","")

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.userId = decoded.userId
        req.userName = decoded.userName
        next()
    } catch (err) {
        return res.status(401).json({Error :  "Session Expired Please login again."})
        
    }
}

module.exports = { requireAuth}