const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/account
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record.role = role;
  }
  res.render("admin/pages/account/index", {
    pageTitle: "Trang Account",
    records: records,
  });
};

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/account/create", {
    pageTitle: "Thêm mới account",
    roles: roles,
  });
};

// [POST] /admin/account/create
module.exports.createPost = async (req, res) => {
  const emailExisting = await Account.findOne({
    deleted: false,
    email: req.body.email,
  });

  if (emailExisting) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/account`);
  }
};

// [GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/account/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/account`);
  }
};

// [PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

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
