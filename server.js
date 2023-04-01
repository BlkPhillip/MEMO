const express = require("express");

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const memoRouter = require("./routes/memos");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
// require checkUser middleware
const { checkUser } = require("./middleware/authMiddleware");

const app = express();

const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");

// view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

// form Override
app.use(methodOverride("_method"));

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(express.json());
app.use(cookieParser());

// DB Conn
const conn = require("./db/conn");

conn();

// check user
app.get("*", checkUser);

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/memos", memoRouter);
app.use(authRoutes);

app.listen(process.env.PORT || 3000);
