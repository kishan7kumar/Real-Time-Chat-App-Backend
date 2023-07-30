const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    });

var Chats = mongoose.model('Chat', chatSchema);
module.exports = Chats;