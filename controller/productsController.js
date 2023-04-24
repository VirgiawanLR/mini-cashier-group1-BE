const { db, query } = require("../database");

module.exports = {
  getProductProducts: async (req, res) => {
    try {
      const products = await query(`SELECT * FROM Products`);
      const count = products.length;
      return res.status(200).send({ products, count });
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
    let createNewProductQuery = `INSERT into Users (product_name, product_price, product_quantity, product_image, product_description) values (${db.escape(
      product_name
    )}, ${db.escape(product_price)}, ${db.escape(
      product_quantity
    )}, ${db.escape(product_image)}, ${db.escape(
      product_description
    )}, ${db.escape(category_ID)})})`;
    try {
      const product = await query(createNewProductQuery);
      let payload = {
        product_ID: product.insertId,
        product_price,
        product_quantity,
        product_image,
        product_description,
        category_ID,
      };

      return res
        .status(200)
        .send({ message: `${product_name} has been created!` });
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },
};
