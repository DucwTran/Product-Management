const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  //res, req có nhiều phương thức lắm
  const filterStatus = filterStatusHelper(req.query); // gọi hàm filterStatusHelper để lấy ra các trạng thái sản phẩm

  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //pagination
  let objectPagination = {
    currentPage: 1,
    limitedItem: 4,
  };
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitedItem;

  const countProduct = await Product.countDocuments(find);
  const totalPage = Math.ceil(countProduct / objectPagination.limitedItem);
  objectPagination.totalPage = totalPage;
  //End Pagination

  //Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //End Sort
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitedItem)
    .skip(objectPagination.skip); //find là method của mongoose định nghĩa do Product là 1 schema

  res.render("admin/pages/product/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái sản phẩm thành công");

  res.redirect("/admin/product");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: "true", deletedAt: new Date() }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `Cập nhật thành công vị trí`);
    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  req.flash("success", `Xóa thành công sản phẩm`);

  res.redirect("/admin/product");
};

// [GET] /admin/product/create
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

  res.render("admin/pages/product/create", {
    pageTitle: "Tạo mới sản phẩm",
    category: newRecords,
  });
};

// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
  if (!req.body.title) {
    res.flash("error", "Vui lòng nhập tiêu đề");
    res.redirect("back");
    return;
  }
  req.body.price = parseInt(req.body.price);
  req.body.discount = parseInt(req.body.discount);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position === "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new Product(req.body);
  await product.save();

  res.redirect(`/admin/product`);
};

// [GET] /admin/product/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
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

    const records = await Category.find({
      deleted: false,
    });
    const newRecords = createTree(records);

    const product = await Product.findOne(find);
    res.render("admin/pages/product/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newRecords,
    });
  } catch (error) {
    res.redirect(`/admin/product`);
  }
};
// [PATCH] /admin/product/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discount = parseInt(req.body.discount);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne({ _id: req.params.id }, req.body);
  } catch (error) {
    console.error("Update product error:", error);
  }
  res.redirect("back");
};

// [GET] /admin/product/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/product/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(`/admin/product`);
  }
};
