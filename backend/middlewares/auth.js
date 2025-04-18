const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    // console.log(req.headers);
    // console.log(req.headers["authorization"].split("Bearer ")[1]);
    try {
        // extracting jwt token using authorization in header
        let token = req.headers["authorization"].split("Bearer ")[1];

        if (!token) {
            console.log(token);
            return res.status(401).json({
                success: false,
                message: "Your token is missing. Please Try Again."
            });
        }

        // Verifying Token
        try {
            const decode = jwt.verify(token, process.env.SUPER_SECRET);
            console.log("Token decoded is ");
            console.log(decode);

            req.body.username = decode.username;       // adding username to request body
            req.body._id = decode.id;
            console.log(req.body);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is InValid."
            });
        }
        next();               // used to move to the next middleware
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Something went wrong while verifying the token."
        });
    }
}