const express = require('express');
const bodyParser = require('body-parser');
const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
SECRET = "RESTAPI" // .env file stores the secrets

const { body, param, validationResult } = require("express-validator")

const router = express.Router()

router.use(bodyParser());
// =========================== REGISTRATION =============================
router.post("/register", body("name"), body("email"), body("password"), async (req, res) => {
    console.log(req.body);
    
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, password } = req.body
        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                return res.status(400).json({ // 400 - user not entering correct format
                    status: "failed",
                    message: "invalid details"
                })
            }
            console.log("creating user");
        try{
            const user = await User.create({
                name,
                email,
                password: hash
            })
            return res.status(200).json({
                status: "Success",
                data: user
            })
        }

     catch(e) {
        console.log("inside catch block");
         return res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }})
})

// ============================ LOGIN =====================================
router.post("/login", body("email"), body("password"), async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {email,password} = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "invalid user"
            })
        } 
        bcrypt.compare(password,user.password).then(function(result){ // user.passsword is decrypted
            if (result){
                var token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60*60),
                    data: user._id
                },SECRET) // token stored in browser cache  -- here, user id and secret are used to generate the token
                
                return res.status(200).json({
                    status:"success",
                    token
                })
            }else{
                return res.status(401).json({
                    status: "failed",
                    message:"not authenticated"
                })
            }
        })

    } catch (e) {
        return res.status(500).json({ 
            status: "Failed",
            message: e.message
        })
    }
})


module.exports = router