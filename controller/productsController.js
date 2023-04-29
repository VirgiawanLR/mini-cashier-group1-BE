const { db, query } = require("../database");

module.exports = {
  getProductProducts: async (req, res) => {
    try {
      const products = await query(`SELECT * FROM Products`);
      const categories = await query(`SELECT * FROM Categories`);
      const count = products.length;
      return res.status(200).send({ products, categories, count });
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },

  createNewProduct: async (req, res) => {
    const {
      product_name,
      product_price,
      product_quantity,
      product_image,
      product_description,
      category_ID,
    } = req.body;

    // console.log(req.body);

    let createNewProductQuery = `INSERT into Products (product_name, product_price, product_quantity, product_image, product_description, category_ID) values (${db.escape(
      product_name
    )}, ${db.escape(product_price)}, ${db.escape(
      product_quantity
    )}, ${db.escape(product_image)}, ${db.escape(
      product_description
    )}, ${db.escape(category_ID)})`;

    try {
      const product = await query(createNewProductQuery);
      const fetch = await query(`SELECT * FROM Products`);
      return res
        .status(200)
        .send({ message: `${product_name} has been created!` }, fetch);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },

  deleteProduct: async (req, res) => {
    const idParams = parseInt(req.params.id);
    const deleteData = await query(
      `DELETE FROM Products WHERE product_ID = ${db.escape(idParams)};`
    );
    try {
      return res.status(200).send(deleteData);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },

  editProduct: async (req, res) => {
    const {
      product_name,
      product_price,
      product_quantity,
      product_image,
      product_description,
      category_ID,
      product_ID,
    } = req.body;

    // console.log(req.body);

    let editProductQuery = `UPDATE Products
    SET product_name = ${db.escape(product_name)},
    product_price = ${db.escape(product_price)},
    product_quantity = ${db.escape(product_quantity)},
    product_image = ${db.escape(product_image)},
    product_description = ${db.escape(product_description)},
    category_ID = ${db.escape(category_ID)}
    WHERE product_ID = ${db.escape(product_ID)}`;

    try {
      const product = await query(editProductQuery);
      const fetch = await query(`SELECT * FROM Products`);
      return res
        .status(200)
        .send({ message: `${product_name} has been edited!` }, fetch);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },
};
