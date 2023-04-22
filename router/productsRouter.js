const express = require("express");

const { productsController } = require("../controller");
const routers = express.Router();

routers.post("/register", productsController.createNewProduct);
routers.get("/home", productsController.getProductHome);

module.exports = routers;
