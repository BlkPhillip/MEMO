const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Author = require("../models/author");
const Memo = require("../models/memo");
const uploadPath = path.join("public", Memo.uploadFiles);
const imageMimeTypes = ["images/jpeg", "images/png", "images/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

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
router.post("/", upload.single("filesUpload"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const memo = new Memo({
    title: req.body.title,
    author: req.body.author,
    date: new Date(req.body.date),
    expense: req.body.expense,
    filesUpload: fileName,
    description: req.body.description,
  });

  try {
    const newMemo = await memo.save();
    //  res.redirect(`authors/${newMemo.id}`);
    res.redirect(`memos`);
  } catch {
    if (memo.filesUpload != null) {
      removeUploadFile(memo.filesUpload);
    }
    renderNewPage(res, memo, true);
  }
});

function removeUploadFile(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

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

module.exports = router;
