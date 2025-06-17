require("dotenv").config();

const express = require("express");
const path = require("path");
const database = require("./config/database");
const systemConfig = require("./config/system");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const methodOverride = require("method-override");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
database.connect();

const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

app.use(cookieParser("egjkewgnkwleg"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.monent = moment;


app.use(express.static(`${__dirname}/public`));
//Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

