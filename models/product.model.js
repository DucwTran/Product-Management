const mongoose = require("mongoose");

var slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: ""
    },
    description: String,
    price: Number,
    thumbnail: String,
    stock: Number,
    discount: Number,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    position: Number,
    slug: { type: String, slug: "title", unique: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
