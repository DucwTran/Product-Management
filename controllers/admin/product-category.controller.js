const Category = require("../../models/category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/product
module.exports.index = async (req, res) => {
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

  res.render("admin/pages/category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [GET] /admin/category/create
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

// [GET] /admin/category/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
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

    const data = await Category.findOne({
      _id: id,
      deleted: false,
    });

    const records = await Category.find(find);
    const newRecords = createTree(records);

    res.render("admin/pages/category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/category`);
  }
};

// [PATCH] /admin/category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);

  await Category.updateOne({ _id: id }, req.body);

  res.redirect("back");
};
