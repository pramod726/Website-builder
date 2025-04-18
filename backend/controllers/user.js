const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

require("dotenv").config();

// Using Cookie parser
app.use(cookieParser());

// route handler
exports.usersignup = async(req, res) => {
    try {
        const {firstname, lastname, username, email, password} = req.body;
        console.log(req.body);
        
        if(!firstname || !lastname || !username || !email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        
        // finding that user is already registered or not 
        const existingUsername = await user.findOne({username:username});
        const existingEmail = await user.findOne({email:email});
        
        if (existingUsername) {
            return res.status(400).json({
                success:false,
                message:"Username not available"
            })
        }
        if (existingEmail) {
            return res.status(400).json({
                success:false,
                message:"User Already Exist."
            })
        }

        // Hashing of Password
        let hashedPswd;

        try {
            hashedPswd = await bcrypt.hash(password, 10);
        }
        catch(err) {
            console.log(err);
            return res.status(500).json(
                {
                    success: false,
                    message: "Error in Hashing Password",
                }
            )
        }


        // Save User info in Database
        const User = new user({
            username, 
            email, 
            password:hashedPswd
        });

        await User.save();
        
        res.status(200).json({
            success:true,
            // data:response,
            message: "User created successfully."
        });
    }

    catch(err) {
        console.error(err);
        console.log(err);
        res.status(500).json(
            {
                success: false,
                message: "User cannot be registered, Please try again later",
            }
        )
    }
}


// user login route
exports.userlogin = async(req, res) => {
    try {
    
        // data fetch
        const {email, password} = req.body;
        
        // validation on email and password that are they NULL or not ?
        if (!email) {
            return res.status(400).json({
                success:false,
                message:"Please fill out your Email."
            })
        }
        if (!password) {
            return res.status(400).json({
                success:false,
                message:"Please fill out your Password."
            })
        }

        // check for registered User
        let loginUser = await user.findOne({email:email}).populate().exec();
        console.log(loginUser);
        
        // if not a registered User
        if (!loginUser) {
            return res.status(401).json({
                success:false,
                message:"User is not registered. Please Sign Up first."
            })
        }

        // if email is not verified
        if (loginUser.verified === false) {
            return res.status(400).json({
                success:false,
                message:"User is not Verified, Please verify your Email First."
            })
        }

        // create a payload for jwt token
        const payload = {
            email:loginUser.email,
            id:loginUser._id,
            username:loginUser.username
        }

        // verify password & generate a JWT token
        if (await bcrypt.compare(password,loginUser.password)) {
            // password match
            let token = jwt.sign(payload, process.env.SUPER_SECRET,{expiresIn:"24h"});

            loginUser.token = token;
            loginUser.password = undefined;

            const options = {
                expires: new Date(Date.now() + 24*60*60*1000),
                httpOnly:true,
            } 

            console.log(token);

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                loginUser,
                message:"User Logged in Successfully."
            })
        }
        else {
            return res.status(201).json({
                success:false,
                message:"Password is Incorrect."
            })
        }
    }

    catch(err) {
        console.error(err);
        console.log(err);
        res.status(500).json(
            {
                success: false,
                message: "User cannot be logged in, Please try again later",
            }
        )
    }
}

exports.logout = async (req, res) => {
    res.clearCookie("t");
    return res.status(200).json({
        success:true,
        message:"User logged out."
    })
}