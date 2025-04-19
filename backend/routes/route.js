const express = require('express');
const router = express.Router();

const { usersignup, userlogin, logout } = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const { prompt, modify } = require('../controllers/agent');

router.post("/user/signUp", usersignup);
router.post("/user/logIn", userlogin);
router.post("/user/logOut", auth, logout);

router.post("/prompt", prompt);
router.post("/modify", modify);

module.exports = router;
