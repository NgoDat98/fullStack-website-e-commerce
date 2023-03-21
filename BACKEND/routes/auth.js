const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// /sigup => add new user
router.post("/sigup", authController.postSignup);

// /login => login user
router.post("/login", authController.postLogin);

// /login-admin =>  login admin
router.post("/login-admin", authController.loginAdmin);

module.exports = router;
