'use strict';

const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    chatType: {
        type: String,
        required: true,
    },
});

const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;
