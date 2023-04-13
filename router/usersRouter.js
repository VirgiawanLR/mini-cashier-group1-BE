const express = require("express");
const { usersController } = require("../controller");
const routers = express.Router();
const { tokenDecoder } = require("../middleware/tokenDecoder");

routers.post("/register", usersController.registerUser);
routers.patch("/verify-account", tokenDecoder, usersController.verifyAccount);
routers.post("/login", usersController.loginAccount);

module.exports = routers;
