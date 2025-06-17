const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/auth
module.exports.login = (req, res) => {
  if (res.cookies.token) {
    const user = Account.findOne({ token: res.cookies.token });
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`); 
    }
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Không tồn tại người dùng");
    res.redirect("back");
    return;
  }
  if (md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }
  if (user.status === "inactive") {
    req.flash("error", "Tài khoản của bạn đã bị khóa");
    res.redirect("back");
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
