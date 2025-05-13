// [GET] /product

const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }); 

  const newProduct = products.map(item => {
    item.newPrice = (item.price*(100 - item.discount)/100).toFixed(2);
    return item;
  })
  
  res.render("client/pages/product/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProduct
  });
};
