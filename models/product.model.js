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
      account_id: String,
      deletedAt: Date, //không dùng default vì chỉ có 1 lần nha, phải update khi xóa
    },
    position: Number,
    slug: { type: String, slug: "title", unique: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
