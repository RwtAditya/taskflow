const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require("../models/userModel");

dotenv.config();
const {body, validationResult, matchedData} = require("express-validator");

const alphaErr = "must only contain letters";
const lengthErr = "must be between 1 to 10 characters";
const hash_pass = 10;


const validateUser = [
    body("username").trim()
    .isAlpha().withMessage(`username ${alphaErr}`)
    .isLength({min:1, max:10}).withMessage(`length ${lengthErr}`),
    body("email").trim()
    .toLowerCase()
    .isEmail().withMessage("Invalid Email"),
    body("password").trim()
    .isLength({min:3,max:12}).withMessage("must be 3 to 12 in size"),
]


exports.registerUser = [
    validateUser,
    async (req, res) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({message: error.array()});
        }


        try{
            const {username, email, password} = req.body;
            const hashed_pass = await bcrypt.hash(password,hash_pass);

            const check = await User.findByEmail(email);

            if(check){
                return res.status(409).json({message:"User already exists"});
            }

            const result = await User.createUser(username,email,hashed_pass);

            return res.status(200).json({message: "success"});

        }
        catch(err){
            console.log("Error creating user",err.stack);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
]

exports.loginUser = async (req, res) => {
    // console.log(req.body);
    const {email, password} = req.body;


    try{
        
        const user = await User.findByEmail(email);

        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({message: "Invalid email or password"});
        }

        const token = jwt.sign(
            {userId: user.id, email:user.email},
            process.env.SECRET_KEY,
            {expiresIn: "1h"}
        );

        return res.status(200).json({message: "Success", token: token});
    }
    catch(err) {
        console.log("Login Error", err.stack);
        return res.status(500).json({message: "Internal server error"});
    }
}

