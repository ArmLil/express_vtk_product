"use strict";

let db = require("../models");

async function getProducts(req, res) {
  console.log("function getProducts");
  try {
    let products = await db.Product.findAndCountAll();
    let count = products.count;

    res.json({
      products,
      count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getProductById(req, res) {
  console.log("function getProductById");
  try {
    let product = await db.Product.findByPk(req.params.id);
    console.log(product);
    if (product == null) {
      throw new Error("validationError: Product with this id not found!");
    }
    res.json({ product });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createProduct(req, res) {
  console.log("function createProduct");
  try {
    const products = await db.Product.findAndCountAll();

    let options = {};
    if (req.body.number) {
      options.number = req.body.number;
    } else {
      return res.status(400).send("Bad Request, number required");
    }
    if (req.body.name) {
      options.name = req.body.name;
    } else {
      return res.status(400).send("Bad Request, name required");
    }

    const findProductByName = await db.Product.findOne({
      where: { name: req.body.name }
    });
    if (findProductByName) {
      throw new Error("validationError: тип с таким названием уже существует");
    }
    const findProductByNumber = await db.Product.findOne({
      where: { number: req.body.number }
    });
    if (findProductByNumber) {
      throw new Error("validationError: тип с таким номером уже существует");
    }
    const product = await db.Product.findOrCreate({
      where: options
    });

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateProduct(req, res) {
  console.log("function updateProduct");
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (product == null)
      throw new Error("validationError: Product by this id not found!");

    if (req.body.name && product.name != req.body.name) {
      //check name
      //do not let the product to be updated with a name which already exists
      const findProductByName = await db.Product.findOne({
        where: { name: req.body.name }
      });
      if (product.name !== req.body.name && findProductByName) {
        throw new Error(
          "validationError: тип с таким названием уже существует!"
        );
      }
      product.name = req.body.name;
    }

    if (req.body.number && product.number != req.body.number) {
      const findProductByNumber = await db.Product.findOne({
        where: { number: req.body.number }
      });
      if (product.number !== req.body.number && findProductByNumber) {
        throw new Error("validationError: тип с таким номером уже существует!");
      }
      product.number = req.body.number;
    }

    await product.save();
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteProduct(req, res) {
  console.log("function deleteProducts");
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (!product) {
      throw new Error("validationError: Product by this id not found!");
    }
    await product.destroy();
    res.json({ massage: `product with id ${product.id} deleted` });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
