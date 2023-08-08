const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Memo = require("../models/memo");
const {
  requireAuth,
  checkUser,
  authRole,
} = require("../middleware/authMiddleware");
// multer
const multer = require("multer");
const path = require("path");
const filesPath = path.join("public", Memo.uploadsPath);
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
const upload = multer({
  dest: filesPath,
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
router.post("/", upload.single("files"), requireAuth, async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const memo = new Memo({
    title: req.body.title,
    author: req.body.author,
    date: new Date(req.body.date),
    expense: req.body.expense,
    fileUpload: fileName,
    description: req.body.description,
  });
  try {
    const newMemo = await memo.save();
    res.redirect(`memos/${newMemo.id}`);
  } catch {
    renderNewPage(res, memo, true);
  }
});

// Show Memo Route
router.get("/:id", async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id).populate("author").exec();
    res.render("memos/show", { memo: memo });
  } catch {
    res.redirect("/");
  }
});

// Edit Memo Route
router.get("/:id/edit", async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    renderEditPage(res, memo);
  } catch {
    res.redirect("/");
  }
});

// Update Memo Route
router.put("/:id", checkUser, authRole("admin"), async (req, res) => {
  let memo;

  try {
    memo = await Memo.findById(req.params.id);
    memo.title = req.body.title;
    memo.author = req.body.author;
    memo.date = new Date(req.body.date);
    memo.expense = req.body.expense;
    memo.description = req.body.description;
    await memo.save();
    res.redirect(`/memos/${memo.id}`);
  } catch {
    if (memo != null) {
      renderEditPage(res, memo, true);
    } else {
      redirect("/");
    }
  }
});

// Delete Memo
router.delete("/:id", checkUser, authRole("admin"), async (req, res) => {
  let memo;
  try {
    memo = await Memo.findById(req.params.id);
    await memo.deleteOne();
    res.redirect("/memos");
  } catch {
    if (memo != null) {
      res.render("memos/show", {
        memo: memo,
        errorMessage: "Error removing Memo",
      });
    } else {
      res.redirect("/");
    }
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

async function renderEditPage(res, memo, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      memo: memo,
    };
    if (hasError) params.errorMessage = "Error Updating Memo";
    res.render("memos/edit", params);
  } catch {
    res.redirect("/memos");
  }
}

module.exports = router;
