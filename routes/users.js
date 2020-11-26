const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const UserSchema = require('../schemas/User.js');
const config = require('config');

router.post(
    '/register',
    [
        check('email', 'The email is incorrect, it must contain an @ or .com || Type a proper email').isEmail(),
        check('password','yor password is invalid or is required').not().isEmpty()
    ],   
    async (req,res) => {
    try {
        let { email, password } = req.body;
        let user = await UserSchema.findOne({ email });
        const errors = validationResult(req); // = []
        if(!errors.isEmpty()){
            return res.status(401).json({ errors: errors.array() });
        }
        if(user){
            return res.status(401).json({ msg: "There is already user with this email" });
        }

        const salt = await bcryptjs.genSalt(10);
        password = await bcryptjs.hash(password,salt);

        user = new UserSchema({
            email,
            password
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            (err,token) => {
                if(err) throw err;
                res.json({ token });
            }
        )

    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "server Error..."});
    }
}
);

router.post('/login',
    [
        check('email', 'The email is incorrect, it must contain an @ or .com || Type a proper email').isEmail(),
        check('password','yor password is required').not().isEmpty()
    ],
     async (req,res) =>{
    try {
        let { email,password } = req.body;
        let user = await UserSchema.findOne({ email });
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(401).json({ errors: errors.array() });
        }

        if(!user){
            return res.status(401).json({ msg: "There is not a user with this email" });
        }

        let isPasswordMatch = await bcryptjs.compare(password, user.password);

        if(isPasswordMatch){
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                (err,token) => {
                    if(err) throw err;
                    res.json({ token }); 
                }  
            )
        }else return res.status(401).json({ msg: "Wrong password" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "server Error..." });
    }
}
)

module.exports = router;