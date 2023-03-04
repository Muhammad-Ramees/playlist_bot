'use strict';

const commands = require('../config/commands.config');
const questionTypes = require('../config/questiontypes.config');
const {
    addChat,
    addMember,
    removeMember,
    releaseVideos,
} = require('../services/bot.service');

const getControllers = (bot) => {
    const state = {
        question: null,
        questionType: null,
        isQuestionAsked: false,
        askedTo: null,
    };

    return {
        async startController(ctx) {
            const adminList = await bot.telegram.getChatAdministrators(
                ctx.chat.id
            );

            const creator = adminList.find(
                (admin) => admin.status === 'creator'
            );

            if (creator.user.id === Number(process.env.OWNER_ID)) {
                ctx.reply("i'm up");
                bot.telegram.setMyCommands(commands);

                await addChat(ctx.chat, (error, chat) => {
                    if (error) {
                        return ctx.reply(JSON.stringify(error));
                    }

                    ctx.reply(JSON.stringify(chat));
                });
            }
        },
        async newChatMemberController(ctx) {
            const adminList = await bot.telegram.getChatAdministrators(
                ctx.chat.id
            );

            const creator = adminList.find(
                (admin) => admin.status === 'creator'
            );

            if (creator.user.id === Number(process.env.OWNER_ID)) {
                await addChat(ctx.chat, (error, chat) => {
                    if (error) {
                        return ctx.reply(JSON.stringify(error));
                    }

                    ctx.reply(JSON.stringify(chat));
                });

                await addMember(
                    {
                        ...ctx.message.new_chat_member,
                        chatId: ctx.chat.id,
                        joiningDate: ctx.message.date * 1000,
                    },
                    (error, member) => {
                        if (error) {
                            return ctx.reply(JSON.stringify(error));
                        }

                        ctx.reply(
                            `Hello ${member.firstname} welcome to ${ctx.chat.title}.`
                        );
                    }
                );
            } else {
                ctx.reply('Action restricted for this chat!');
            }
        },
        async leftChatMemberController(ctx) {
            await removeMember(ctx.message.left_chat_member.id, (error) => {
                if (error) {
                    return ctx.reply(JSON.stringify(error));
                }
            });
        },
        async releaseVideoController(ctx) {
            const adminList = await bot.telegram.getChatAdministrators(
                ctx.chat.id
            );

            const admin = adminList.find(
                (admin) => admin.user.id === ctx.from.id
            );

            if (admin) {
                state.question = 'Enter the playlist id to release videos';
                state.questionType = questionTypes.PLAYLIST_ID;
                state.isQuestionAsked = true;
                state.askedTo = ctx.from.id;

                return ctx.reply(state.question, {
                    reply_to_message_id: ctx.message.message_id,
                });
            }

            return ctx.reply('Access denied', {
                reply_to_message_id: ctx.message.message_id,
            });
        },
        async textController(ctx) {
            const adminList = await bot.telegram.getChatAdministrators(
                ctx.chat.id
            );

            const admin = adminList.find(
                (admin) => admin.user.id === ctx.from.id
            );

            if (
                state.isQuestionAsked &&
                state.questionType === questionTypes.PLAYLIST_ID &&
                admin
            ) {
                await releaseVideos(ctx.message.text);
                return ctx.reply('Video release has been initiated', {
                    reply_to_message_id: ctx.message.message_id,
                });
            }
        },
    };
};

module.exports = getControllers;
