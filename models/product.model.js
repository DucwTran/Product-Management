const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  discount: Number,
  status: String,
  deleted: Boolean,
});

const Product = mongoose.model("Product", productSchema, "product");

module.exports = Product;
