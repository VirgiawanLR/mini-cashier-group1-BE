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

    // console.log(req.body);

    let createNewProductQuery = `INSERT into Products (product_name, product_price, product_quantity, product_image, product_description, category_ID) values (${db.escape(
      product_name
    )}, ${db.escape(product_price)}, ${db.escape(
      product_quantity
    )}, ${db.escape(product_image)}, ${db.escape(
      product_description
    )}, ${db.escape(category_ID)})`;

    console.log(createNewProductQuery);

    try {
      const product = await query(createNewProductQuery);
      console.log(product);
      return res.status(200).send({ message: `Product has been created!` });
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },
};
