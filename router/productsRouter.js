const express = require("express");

const { productsController } = require("../controller");
const routers = express.Router();

routers.post("/create-product", productsController.createNewProduct);
routers.get("/home", productsController.getProductHome);

module.exports = routers;
