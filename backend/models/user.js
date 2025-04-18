const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            maxLenth: 50,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            maxLenth: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLenth: 8,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
        },
    }
)

module.exports = mongoose.model("User", userSchema);