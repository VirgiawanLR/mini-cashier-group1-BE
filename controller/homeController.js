const { db, query } = require("../database");

module.exports = {
  getProductHome: async (req, res) => {
    try {
      const products = await query(`SELECT * FROM Products`);
      const count = products.length;
      return res.status(200).send({ products, count });
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },
  nextPage: async (req, res) => {
    try {
      const { indexStart, indexEnd } = req.body;
      const products = await query(
        `SELECT * FROM Products WHERE product_id BETWEEN ${db.escape(
          indexStart
        )} AND ${db.escape(indexEnd)}`
      );
      const count = products.length;
      const productRange = { indexStart, indexEnd };
      return res.status(200).send({ products, count, productRange });
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },
  createNewProduct: async (req, res) => {},
};
