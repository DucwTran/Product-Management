const Category = require("../../models/category.model");

module.exports.category = async (req, res, next) => {
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
  res.locals.layoutProductsCategory = newRecords;
  next();
};
