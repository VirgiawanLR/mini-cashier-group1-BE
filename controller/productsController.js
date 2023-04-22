const { db, query } = require("../database");

module.exports = {
  getProductHome: async (req, res) => {
    try {
      const products = await query(`SELECT * FROM Products`);
      return res.status(200).send(products);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error);
    }
  },
  createNewProduct: async (req, res) => {},
};
