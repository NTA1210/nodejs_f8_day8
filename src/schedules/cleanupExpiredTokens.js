const revokedTokenModel = require("../models/revokedToken.model");

const cleanUpExpiredTokens = async () => {
  await revokedTokenModel.deleteExpiredToken();
};

module.exports = cleanUpExpiredTokens;
