const express = require("express");

const { productsController } = require("../controller");
const routers = express.Router();

routers.get("/", productsController.getProductProducts);
routers.post("/create", productsController.createNewProduct);
routers.put("/edit/:id", productsController.editProduct);
routers.delete("/delete/:id", productsController.deleteProduct);

module.exports = routers;
