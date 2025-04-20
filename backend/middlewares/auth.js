const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        // console.log("[auth] Request received:", { body: req });
        const token = req.cookies.token;
        console.log("[auth] Token received:", token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Your token is missing. Please log in again."
            });
        }

        try {
            const decode = jwt.verify(token, process.env.SUPER_SECRET);
            console.log("[auth] Token decoded:", decode);
            if (!req.body) req.body = {};

            req.body.email = decode.email;
            req.body._id = decode.id;

            next();
        } catch (error) {
            console.log("[auth] Token verification failed:", error);    
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please log in again."
            });
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Something went wrong while verifying the token."
        });
    }
};
