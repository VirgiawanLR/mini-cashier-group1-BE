const express = require("express");
const { usersController } = require("../controller");
const routers = express.Router();

routers.post("/register", usersController.registerUser);

module.exports = routers;
