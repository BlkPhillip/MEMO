const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Memo = require("../models/memo");
const imageMimeTypes = ["images/jpeg", "images/png", "images/gif"];

// All Memos Route
router.get("/", async (req, res) => {
  let query = Memo.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.date_before != null && req.query.date_before != "") {
    query = query.lte("date", req.query.date_before);
  }
  if (req.query.date_after != null && req.query.date_after != "") {
    query = query.gte("date", req.query.date_after);
  }
  try {
    const memos = await query.exec();
    res.render("memos/index", {
      memos: memos,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Memo Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Memo());
});

// Create Memo Route
router.post("/", async (req, res) => {
  const memo = new Memo({
    title: req.body.title,
    author: req.body.author,
    date: new Date(req.body.date),
    expense: req.body.expense,
    description: req.body.description,
  });
  saveUpfiles(memo, req.body.filesUp);

  try {
    const newMemo = await memo.save();
    //  res.redirect(`authors/${newMemo.id}`);
    res.redirect(`memos`);
  } catch {
    renderNewPage(res, memo, true);
  }
});

async function renderNewPage(res, memo, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      memo: memo,
    };
    if (hasError) params.errorMessage = "Error Creating Memo";
    res.render("memos/new", params);
  } catch {
    res.redirect("/memos");
  }
}

function saveUpfiles(memo, fileEncoded) {
  if (fileEncoded == null) return;
  const file = JSON.parse(fileEncoded);
  if (file != null && imageMimeTypes.includes(file.type)) {
    memo.filesUpload = new Buffer.from(file.data, "base64");
    memo.filesUploadType = file.type;
  }
}

module.exports = router;
