const express = require("express");
const database = require("./config/database")
const systemConfig = require("./config/system")
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const methodOverride = require("method-override");
const flash = require("express-flash");
const cookieParser = require("cookie-parser")
const session = require("express-session")

require("dotenv").config();
database.connect();

const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

app.use(cookieParser('egjkewgnkwleg'));
app.use(session({cookie: {maxAge: 60000}}));
app.use(flash());

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));
//Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});


//route ----(với path đó thì gọi đến)-----> controller -----(không chứa logic nghiệp vụ, tương tác với model, dùng method của model/class để tạo ra data, trả ra giao diện) -----> 