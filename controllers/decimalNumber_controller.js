"use strict";

let db = require("../models");

async function getDecimalNumbers(req, res) {
  console.log("function getDecimalNumbers");
  try {
    let decimalNumbers = await db.DecimalNumber.findAndCountAll();
    let count = decimalNumbers.count;

    res.json({
      decimalNumbers,
      count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getDecimalNumberById(req, res) {
  console.log("function getDecimalNumberById");
  try {
    let decimalNumber = await db.DecimalNumber.findByPk(req.params.id);
    console.log(decimalNumber);
    if (decimalNumber == null) {
      throw new Error("validationError: DecimalNumber with this id not found!");
    }
    res.json({ decimalNumber });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createDecimalNumber(req, res) {
  console.log("function createDecimalNumber");
  try {
    let options = {};
    if (req.body.name) {
      options.name = req.body.name;
    } else {
      return res.status(400).send({ "Bad Request": "name required" });
    }

    const findDecimalNumberByName = await db.DecimalNumber.findOne({
      where: { name: req.body.name }
    });

    if (findDecimalNumberByName) {
      throw new Error(
        "validationError: децимальный номер с таким названием уже существует"
      );
    }

    if (req.body.note) options.note = req.body.note;

    const decimalNumber = await db.DecimalNumber.findOrCreate({
      where: options
    });

    res.json({ decimalNumber });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateDecimalNumber(req, res) {
  console.log("function updateDecimalNumber");
  try {
    const decimalNumber = await db.DecimalNumber.findByPk(req.params.id);
    if (decimalNumber == null)
      throw new Error("validationError: DecimalNumber by this id not found!");

    if (req.body.name && decimalNumber.name != req.body.name) {
      //check decimalNumber
      //do not let the decimalNumber to be updated with a decimalNumber which already exists
      const findDecimalNumberByName = await db.DecimalNumber.findOne({
        where: { name: req.body.name }
      });
      if (findDecimalNumberByName) {
        throw new Error(
          "validationError: децимальный номер с таким названием уже существует!"
        );
      }
      decimalNumber.name = req.body.name;
    }

    if (req.body.note) decimalNumber.note = req.body.note;

    await decimalNumber.save();
    res.json({ decimalNumber });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteDecimalNumber(req, res) {
  console.log("function deleteDecimalNumbers");
  try {
    const decimalNumber = await db.DecimalNumber.findByPk(req.params.id);
    if (!decimalNumber) {
      throw new Error("validationError: DecimalNumber by this id not found!");
    }
    await decimalNumber.destroy();
    res.json({
      massage: `decimalNumber with id ${decimalNumber.id} deleted`
    });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getDecimalNumbers,
  getDecimalNumberById,
  createDecimalNumber,
  updateDecimalNumber,
  deleteDecimalNumber
};
