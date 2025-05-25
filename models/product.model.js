const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  discount: Number,
  status: String,
  deleted: Boolean,
  deletedAt: Date,
  position: Number,
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
