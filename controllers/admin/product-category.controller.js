const filterStatusHelper = require("../../helpers/filterStatus");
const Category = require("../../models/category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Category.find(find);

  const filterStatus = filterStatusHelper(req.query);
  res.render("admin/pages/category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
  });
};

// [GET] /admin/category
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  const records = await Category.find(find);
  const newRecords = createTree(records);

  const filterStatus = filterStatusHelper(req.query);
  res.render("admin/pages/category/create", {
    pageTitle: "Thêm danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await Category.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new Category(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/category`);
};
