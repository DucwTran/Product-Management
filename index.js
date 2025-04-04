const express = require("express");
require("dotenv").config();

const database = require("./config/database")

const systemConfig = require("./config/system")

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));

//Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});


//route ----(với path đó thì gọi đến)-----> controller -----(không chứa logic nghiệp vụ, tương tác với model, dùng method của model/class để tạo ra data, trả ra giao diện) -----> 