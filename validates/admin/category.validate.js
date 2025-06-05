module.exports.createPost = (res, req, next) => {
  if (!res.body.title) {
    res.flash("error", "Vui lòng nhập tiêu đề");
    res.redirect("back");
    return;
  }
  next();
};
