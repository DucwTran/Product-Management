const systemConfig = require("../../config/system")

const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.route")
const categoryRoutes = require("./category.route");
const roleRoutes = require("./roles.route");



module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_ADMIN + "/product", productRoutes);
  app.use(PATH_ADMIN + "/category", categoryRoutes);
  app.use(PATH_ADMIN + "/roles", roleRoutes);
};
