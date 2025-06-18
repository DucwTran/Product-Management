const productRoutes = require("./product.route");
const homeRoutes = require("./home.routes");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category); //cái nào cũng cần thì dùng trước khi định tuyến 
  app.use("/", homeRoutes);
  app.use("/product", productRoutes);
};
