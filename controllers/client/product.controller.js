// [GET] /product

const Product = require("../../models/product.model");

//[GET] /product
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProduct = products.map((item) => {
    item.newPrice = ((item.price * (100 - item.discount)) / 100).toFixed(2);
    return item;
  });

  res.render("client/pages/product/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProduct,
  });
};


//[GET] /product/:slug        
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    };
    const product = await Product.findOne(find);
    res.render("client/pages/product/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/product`);
  }

};
