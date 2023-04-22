const express = require("express");

const { homeController } = require("../controller");
const routers = express.Router();

routers.get("/", homeController.getProductHome);
routers.post("/next", homeController.nextPage);

module.exports = routers;
