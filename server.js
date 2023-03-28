const express = require("express");
const app = express();
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const memoRouter = require("./routes/memos");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ limit: "10mb", extended: false }));

// DB Conn
const conn = require("./db/conn");

conn();

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/memos", memoRouter);

app.listen(process.env.PORT || 3000);
