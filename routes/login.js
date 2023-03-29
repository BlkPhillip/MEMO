const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("logs/login");
});

router.post("/login", (req, res) => {});

module.exports = router;
