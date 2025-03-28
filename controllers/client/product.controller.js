const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }); // lấy ra tất cả nếu truyền vào {}

  const newProduct = products.map(item => {
    item.newPrice = (item.price*(100 - item.discount)/100).toFixed(2);
    return item;
  })

  console.log(products);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProduct
  });
};
