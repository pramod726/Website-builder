const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

require("dotenv").config();

// Middleware
app.use(cookieParser());

// USER SIGNUP
exports.usersignup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(403).json({ success: false, message: "All fields are required" });
    }

    const existingUsername = await user.findOne({ username });
    const existingEmail = await user.findOne({ email });

    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      name: fullname,
      email,
      username,
      passwordHash,
      tokenList: []
    });

    const payload = {
      email: newUser.email,
      id: newUser._id,
      username: newUser.username
    };

    const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: "24h" });

    newUser.tokenList.push(token);
    await newUser.save();

    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    res.cookie("token", token, options).status(201).json({
      success: true,
      token,
      user: {
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        id: newUser._id
      },
      message: "User created and logged in"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// USER LOGIN
exports.userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log("email ->", email);
     console.log("password ->", password );
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    let loginUser = await user.findOne({ email });

    if (!loginUser) {
      return res.status(401).json({ success: false, message: "User is not registered. Please Sign Up first." });
    }

    const passwordMatch = await bcrypt.compare(password, loginUser.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Password is Incorrect." });
    }

    const payload = {
      email: loginUser.email,
      id: loginUser._id,
      username: loginUser.username
    };

    const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: "24h" });

    loginUser.tokenList.push(token);
    await loginUser.save();

    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: {
        email: loginUser.email,
        username: loginUser.username,
        name: loginUser.name,
        id: loginUser._id
      },
      message: "User Logged in Successfully."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "User cannot be logged in, Please try again later" });
  }
};

// USER LOGOUT
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    const currentUser = await user.findById(req.body._id);

    if (currentUser) {
      currentUser.tokenList = currentUser.tokenList.filter((t) => t !== token);
      await currentUser.save();
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: false // set to true in production with HTTPS
    });

    return res.status(200).json({ success: true, message: "User logged out." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};
