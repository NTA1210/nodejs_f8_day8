const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { verifyEmailSecret } = require("../config/jwt");
const { ERROR_MESSAGES, HTTP_STATUS } = require("../config/constants");
const userModel = require("../models/user.model");
const queueService = require("../services/queue.service");
const authService = require("../services/auth.service");

const register = async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.register({ email, password });
  res.success(user, HTTP_STATUS.CREATED, tokens);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);

  if (!user) {
    return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = await authService.responseWithTokens(user);
  res.success(user, HTTP_STATUS.OK, tokens);
};

const getCurrentUser = async (req, res) => {
  res.success(req.user);
};

const refreshToken = async (req, res) => {
  const refreshToken = req.body.refresh_token;
  const user = await userModel.findByRefreshToken(refreshToken);

  if (!user) {
    return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = await authService.responseWithTokens(user);
  res.success(tokens);
};

const verifyEmail = async (req, res) => {
  const token = req.body.token;
  const payload = jwt.verify(token, verifyEmailSecret);

  if (payload.exp < Date.now()) {
    res.error("Token het han");
    return;
  }

  const userId = payload.sub;
  const user = await userModel.findOne(userId);

  if (user.verified_at) {
    res.error("Token da het han hoac khong hop le", 403);
    return;
  }

  await userModel.verifyEmail(userId);

  res.success("Verify email thanh cong");
};

const resendVerifyEmail = async (req, res) => {
  if (req.user.verified_at) {
    res.error("Tai khoan da duoc xac minh!", 400);
    return;
  }

  queueService.push({
    type: "sendVerifyEmail",
    payload: {
      id: req.user.id,
      email: req.user.email,
    },
  });

  res.success("Resend verify email thanh cong");
};

const logout = async (req, res) => {
  const user_id = req.user.id;
  const token = req.token;

  await authService.logout(user_id, token);
  res.success("Logout thanh cong");
};

const changePassword = async (req, res) => {
  const { current_pass, new_pass, confirm_pass } = req.body;
  const user = req.user;

  console.log(current_pass, new_pass, confirm_pass, user);

  const isValid = await bcrypt.compare(current_pass, user.password);
  if (!isValid) {
    return res.error("Mật khẩu hiện tại không đúng", 400);
  }

  if (new_pass !== confirm_pass) {
    return res.error("Mật khẩu xác nhận không khớp", 400);
  }

  const samePassword = await bcrypt.compare(new_pass, user.password);
  if (samePassword) {
    return res.error("Mật khẩu mới không được giống mật khẩu hiện tại", 400);
  }

  const hashedPassword = await bcrypt.hash(new_pass, 10);
  await userModel.updatePassword(user.id, hashedPassword);

  queueService.push({
    type: "sendPasswordChangeEmail",
    payload: {
      id: user.id,
      email: user.email,
    },
  });

  res.success("Đổi mật khẩu thành công");
};

module.exports = {
  register,
  login,
  getCurrentUser,
  refreshToken,
  verifyEmail,
  resendVerifyEmail,
  logout,
  changePassword,
};
