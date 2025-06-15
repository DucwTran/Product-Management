module.exports.createPost = (res, req, next) => {
  if (!res.body.fullName) {
    res.flash("error", "Vui lòng nhập tên");
    res.redirect("back");
    return;
  }
  if (!res.body.email) {
    res.flash("error", "Vui lòng nhập email");
    res.redirect("back");
    return;
  }
  if (!res.body.password) {
    res.flash("error", "Vui lòng nhập password");
    res.redirect("back");
    return;
  }
  next();
};

module.exports.editPatch = (res, req, next) => {
  if (!res.body.fullName) {
    res.flash("error", "Vui lòng nhập tên");
    res.redirect("back");
    return;
  }
  if (!res.body.email) {
    res.flash("error", "Vui lòng nhập email");
    res.redirect("back");
    return;
  }
  next();
};

module.exports.loginPost = (res, req, next) => {
  if (!res.body.email) {
    res.flash("error", "Vui lòng nhập email");
    res.redirect("back");
    return;
  }
  if (!res.body.password) {
    res.flash("error", "Vui lòng nhập pass");
    res.redirect("back");
    return;
  }
  next();
};
