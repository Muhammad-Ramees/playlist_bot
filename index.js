'use strict';

const dotenv = require('dotenv');
const { Telegraf } = require('telegraf');
const logger = require('./config/logger.config');
const db = require('./config/db.config');
const getControllers = require('./controllers/bot.controller');

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const {
    startController,
    newChatMemberController,
    leftChatMemberController,
    releaseVideoController,
    textController,
} = getControllers(bot);

// Connect database
db.connect();

bot.start(startController);

bot.on('new_chat_members', newChatMemberController);

bot.on('left_chat_member', leftChatMemberController);

bot.command('release', releaseVideoController);

bot.on('text', textController);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => {
    logger.info('SIGINT recived');
    db.close();
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
    logger.info('SIGTERM recived');
    db.close();
    bot.stop('SIGTERM');
});
