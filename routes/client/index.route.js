const productRoutes = require("./product.route")
const homeRoutes = require("./home.routes")

module.exports = (app) => {
  app.use("/", homeRoutes)
  app.use("/product", productRoutes)
};
