const crypto = require("crypto");
const { secret } = require("../config/jwt");
const userModel = require("../models/user.model");

const authRequired = async (req, res, next) => {
    const accessToken = req.headers.authorization
        ?.replace("Bearer", "")
        ?.trim();
    const [encodedHeader, encodedPayload, clientSignature] =
        accessToken?.split(".") ?? [];

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${encodedHeader}.${encodedPayload}`);

    const signature = hmac.digest("base64url");

    if (signature !== clientSignature) {
        return res.error("Unauthorized", 401);
    }

    const payload = JSON.parse(atob(encodedPayload));

    if (payload.exp < Date.now()) {
        return res.error("Unauthorized", 401);
    }

    const currentUser = await userModel.findOne(payload.sub);

    if (!currentUser) {
        return res.error("Unauthorized", 401);
    }

    req.user = currentUser;

    next();
};

module.exports = authRequired;
