const commands = require('../config/commands.config');
const {
    addChat,
    addMember,
    removeMember,
} = require('../services/bot.services');

const getControllers = (bot) => {
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
    };
};

module.exports = getControllers;
