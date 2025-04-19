const express = require('express');
const router = express.Router();

const { usersignup, userlogin, logout } = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const { prompt } = require('../controllers/agent');

router.post("/user/signUp", usersignup);
router.post("/user/logIn", userlogin);
router.post("/user/logOut", auth, logout);

router.post("/prompt", prompt);

module.exports = router;
