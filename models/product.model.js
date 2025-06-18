const mongoose = require("mongoose");

var slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: "",
    },
    description: String,
    price: Number,
    thumbnail: String,
    stock: Number,
    discount: Number,
    status: String,
    createdBy: {
      //Dùng để logs action chi tiết
      account_id: String,
      createAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      //Dùng để logs action chi tiết
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: {
      //Dùng để logs action chi tiết - muốn thêm thì cứ lưu logs khi thực hiện hành động vào các field này
      account_id: String,
      createdAt: Date,
    },
    position: Number,
    slug: { type: String, slug: "title", unique: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
