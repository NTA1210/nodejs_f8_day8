const emailService = require("../services/email.service");

async function sendPasswordChangeEmail(payload) {
  await emailService.sendPasswordChangeEmail(payload);
}

module.exports = sendPasswordChangeEmail;
