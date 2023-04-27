const express = require("express");

const { productsController } = require("../controller");
const routers = express.Router();

routers.get("/", productsController.getProductProducts);
routers.post("/create", productsController.createNewProduct);

module.exports = routers;
