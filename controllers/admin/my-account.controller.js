const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Trang profile",
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Edit profile",
  });
};
// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = req.user.id;
  
    const emailExisting = await Account.findOne({
      _id: {
        $ne: id,
      },
      deleted: false,
      email: req.body.email,
    });
    if (emailExisting) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect("back");
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
    }
  
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
};
