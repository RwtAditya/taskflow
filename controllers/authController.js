const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const {body, validationResult, matchedData} = require("express-validator");
dotenv.config();

const alphaErr = "must only contain letters";
const lengthErr = "must be between 1 to 10 characters";
const hash_pass = 10;


const validateUser = [
    body("username").trim()
    .isAlpha().withMessage(`username ${alphaErr}`)
    .isLength({min:1, max:10}).withMessage(`length ${lengthErr}`),
    body("email").trim()
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

            const query = "INSERT INTO users (username, email, hashed_pass) VALUES($1,$2,$3)";
    
            const result = await pool.query(query, [username,email,password]);

            return res.status(200).json({message: "success"});

        }
        catch(err){
            if(err) {
                console.log(err.stack);
                return res.status(500).json({message: "Internal Server Error"});
            }
        }
    }
]

exports.loginUser = (req, res) => {
    console.log(req.body);
    const {email, password} = req.body;

    const query = 'SELECT * FROM users WHERE email = $1';
    pool.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);
            return res.status(500).json({message: 'Internal server error'});
        }
        if (result.rows.length === 0) {
            return res.status(401).json({message: 'Invalid email or password'});
        }
        const user = result.rows[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords', err.stack);
                return res.status(500).json({message: 'Internal server error'});
            }
            if (!isMatch) {
                return res.status(401).json({message: 'Invalid email or password'});
            }
            const token = jwt.sign(
                {userId: user.id, email: user.email},
                process.env.JWT_SECRET,
                {expiresIn: '1h'}
            );
            res.status(200).json({token});
        });
    });
}

