const express = require("express");

const { productsController } = require("../controller");
const routers = express.Router();

routers.post("/register", productsController.registerNewProducts);

module.exports = routers;
