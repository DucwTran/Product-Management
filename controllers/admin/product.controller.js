const Product = require("../../models/product.model");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  //res, req có nhiều phương thức lắm
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  if (req.query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status == req.query.status
    );
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }

  let find = {
    deleted: false,
  };
  if(req.query.status) {
    find.status = req.query.status;
  }

  const products = await Product.find(find); //find là method của mongoose định nghĩa do Product là 1 schema

  res.render("admin/pages/product/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
  });
};
