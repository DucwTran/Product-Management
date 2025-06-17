const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const categoryRoutes = require("./category.route");
const roleRoutes = require("./roles.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes
  );
  app.use(PATH_ADMIN + "/product", authMiddleware.requireAuth, productRoutes);
  app.use(PATH_ADMIN + "/category", authMiddleware.requireAuth, categoryRoutes);
  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
  app.use(PATH_ADMIN + "/account", authMiddleware.requireAuth, accountRoutes);
  app.use(PATH_ADMIN + "/auth", authRoutes);
};
