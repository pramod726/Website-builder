const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dbconnect = require('./db/db_connect');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;
app.use(cors({ 
    origin:'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
     }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

const router = require('./routes/route');

app.use("/api", router);


dbconnect();

app.use("/", (req, res) => {
    res.send('<h1> This is homepage baby</h1>');
});


app.listen(PORT, () => {
    console.log(`Server successfully started at ${PORT}`);
});