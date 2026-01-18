require("dotenv").config();

const { CronJob } = require("cron");
const backupDB = require("./src/schedules/backupDB1");
const cleanUpExpiredTokens = require("./src/schedules/cleanupExpiredTokens");

console.log(__filename);

new CronJob("* * 3 * * *", backupDB, null, true);
new CronJob("*/5 * * * * *", cleanUpExpiredTokens, null, true);
