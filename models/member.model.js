'use strict';

const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBot: {
        type: Boolean,
        required: true,
    },
    joiningDate: {
        type: Number,
        required: true,
    },
    leavingDate: {
        type: Number,
    },
    isTerminated: {
        type: Boolean,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },
});

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;
