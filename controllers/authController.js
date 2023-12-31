const User = require("../models/user");
const jwt = require("jsonwebtoken");

// handle erros
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }

  // incorrect email
  if (err.message === "incorrect password") {
    errors.password = "password is incorrect";
  }

  // duplicate email err message
  if (err.code === 1100) {
    errors.email = "that email is already been used";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create token function const masAge is 3 days in seconds for jwt and milisecondes for cookies
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret token", {
    expiresIn: maxAge,
  });
};

exports.signup_get = (req, res) => {
  res.render("logs/signup");
};

exports.login_get = (req, res) => {
  res.render("logs/login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.create({ email, password, role });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    console.log(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
