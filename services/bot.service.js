'use strict';

const Chat = require('../models/chat.model');
const Member = require('../models/member.model');
const { getPlaylistVideos } = require('./youtube.service');
const createJob = require('./cron.service');

exports.addChat = async (chatDetails, done) => {
    const { id, title, type } = chatDetails;

    try {
        const chat = await Chat.findOne({ chatId: id });

        if (!chat) {
            const newChat = new Chat({
                chatId: id,
                title,
                chatType: type,
            });

            const chat = await newChat.save();

            return done(null, chat);
        }

        return;
    } catch (error) {
        return done(error);
    }
};

exports.addMember = async (memberDetails, done) => {
    const { id, username, first_name, is_bot, chatId, joiningDate } =
        memberDetails;

    try {
        const member = await Member.findOne({
            userId: id,
            chatId,
            isActive: true,
        });

        if (!member) {
            const newMember = await Member.create({
                chatId,
                userId: id,
                username,
                firstname: first_name,
                isBot: is_bot,
                joiningDate,
            });

            const member = await newMember.save();
            return done(null, member);
        }

        return;
    } catch (error) {
        return done(error);
    }
};

exports.removeMember = async (userId, done) => {
    try {
        await Member.findOneAndDelete({ userId });
        return done();
    } catch (error) {
        return done(error);
    }
};

exports.releaseVideos = async (playlistId, done) => {
    const state = {
        videoIndex: 0,
        job: null,
    };
    try {
        const playlistItems = await getPlaylistVideos(playlistId);

        createJob(
            () => {
                if (state.job && state.index > playlistItems.length) {
                    return job.stop();
                }

                const videoLink = playlistItems.videos[state.videoIndex];
                state.videoIndex += 1;
                return done(null, videoLink);
            },
            (err, job) => {
                if (err) {
                    return err;
                }

                state.job = job;
            }
        );
    } catch (err) {
        return done(err);
    }
};
