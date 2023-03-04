'use strict';

const CronJob = require('cron').CronJob;

const createJob = (exec, done) => {
    try {
        const job = new CronJob('0 30 7 * * *', exec);
        job.start();

        return done(null, job);
    } catch (err) {
        return done(err);
    }
};

module.exports = createJob;
