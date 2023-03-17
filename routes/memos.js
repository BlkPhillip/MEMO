const express = require("express");
const router = express.Router();
const Memo = require("../models/memo");

// All memos Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const memos = await Memo.find(searchOptions);
    res.render("memos/index", { memos: memos, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

// New memo Route
router.get("/new", (req, res) => {
  res.render("memos/new", { memo: new Memo() });
});

// Create Memo Route
router.post("/", async (req, res) => {
  const memo = new Memo({
    name: req.body.name,
  });
  try {
    const newMemo = await memo.save();
    res.redirect(`memos/${newMemo.id}`);
    res.redirect(`memos`);
  } catch {
    res.render("memos/new", {
      memo: memo,
      errorMessage: "Error creating Memo",
    });
  }
});

module.exports = router;
