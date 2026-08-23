const bcrypt = require("bcryptjs")
const db = require("../db")
const jwt = require("jsonwebtoken")

require("dotenv").config()

async function login(req,res) {

    try {
        const email = req.body.email.trim().toLowerCase()
        const password = req.body.password

        const result = await db.query("SELECT * from users where email = $1",[email])
        

        if(result.rows.length ===0){
            console.log("Invalid Email Id")
           return res.status(401).json({Error :"Invalid Email Id"})
        }

        const user = result.rows[0]

        const passwordMatches = await bcrypt.compare(password , user.password_hash)

        if(!passwordMatches){
            console.log("Invalid Password")
            return res.status(401).json({Error : "Invalid Password"})
        }

        

        const token = jwt.sign({userId : user.id , userName: user.user_name},
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        )

        res.json({token :token})



    } catch (err) {
        console.log(err)
        res.status(500).json({Error : "Could not login"})
    }
    
}

async function register(req,res) {

    try {
        const email = req.body.email.trim().toLowerCase()
        const password = req.body.password
        const userName = req.body.name

        if(!email || !password ){
            return res.status(400).json({Error : "Email and password Required"})
        }
        if(password.length<6){
            return res.status(400).json({Error : "Password Must be length of 6 characters"})
        }

        const passwordHarsh = await bcrypt.hash(password , 10)

        const result = db.query("INSERT INTO users (user_name,email , password_hash) VALUES ($1,$2, $3) RETURNING id,email" , [userName,email ,passwordHarsh])

        return res.status(201).json((await result).rows[0])

    } catch (err) {

        if(err.code ==='23505'){
            return res.status(409).json({Error :"User already Exist"})
        }
        console.log(err)

        res.status(500).json({Error : "Could not create a account at this moment"})
        
    }
    
}

module.exports = {register ,login}