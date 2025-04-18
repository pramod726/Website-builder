const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dbconnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then( () => console.log("Connection with db is successful"))
    .catch( (error) => {
        console.log("Error reported ", error);
        process.exit(1);
    });
}

module.exports = dbconnect;