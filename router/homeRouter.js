const express = require("express");

const { homeController } = require("../controller");
const routers = express.Router();

routers.get("/", homeController.getProductHome);

module.exports = routers;
