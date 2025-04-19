const express = require('express');
const router = express.Router();

const { usersignup, userlogin, logout } = require('../controllers/user');
const { auth } = require('../middlewares/auth');

router.post("/user/signUp", usersignup);
router.post("/user/logIn", userlogin);
router.post("/user/logOut", auth, logout);

module.exports = router;
