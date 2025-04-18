const express = require('express');
const router = express.Router();


const {usersignup, userlogin, logout} = require('../controllers/user');
const {auth} = require('../middlewares/auth');


router.post("/usersignup", usersignup);
router.post("/userlogin", userlogin);
router.post("/logout",auth, logout);

module.exports = router;