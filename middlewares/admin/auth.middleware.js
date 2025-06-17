const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

module.exports.requireAuth = (req, res, next) => {
  if (!res.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = Account.findOne({ token: res.cookies.token });
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      next();
    }
  }
};
