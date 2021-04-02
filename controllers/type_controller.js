"use strict";

let db = require("../models");

async function getTypes(req, res) {
  console.log("function getTypes");
  try {
    let types = await db.Type.findAndCountAll();
    let count = types.count;

    res.json({
      types,
      count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getTypeById(req, res) {
  console.log("function getTypeById");
  try {
    let type = await db.Type.findByPk(req.params.id);
    if (type == null) {
      throw new Error("validationError: Type with this id not found!");
    }
    res.json({ type });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createType(req, res) {
  console.log("function createType");
  try {
    let options = {};
    if (req.body.number) {
      let _type = await db.Type.findOne({
        where: { number: req.body.number }
      });
      if (_type) {
        throw new Error("Тип с таким номером уже существует.");
      }
      options.number = req.body.number;
    } else {
      const typesByNumbers = await db.Type.findAndCountAll();
      if (typesByNumbers.rows.length == 0) {
        options.number = "01";
      } else {
        let typesByNumbersArr = typesByNumbers.rows.map((type, i) => {
          return Number(type.dataValues.number);
        });
        typesByNumbersArr.sort(function(a, b) {
          return a - b;
        });
        const maxNumber = typesByNumbersArr[typesByNumbersArr.length - 1];
        let number = (+maxNumber + 1).toString();
        if (maxNumber.toString().length < 3) {
          number = ("00" + (+maxNumber + 1)).slice(-2);
        }
        options.number = number;
      }
    }

    if (req.body.name) {
      options.name = req.body.name;
    } else {
      return res.status(400).send({ "Bad Request": "name required" });
    }

    const findTypeByName = await db.Type.findOne({
      where: { name: req.body.name }
    });
    if (findTypeByName) {
      throw new Error("validationError: тип с таким названием уже существует");
    }
    const findTypeByNumber = await db.Type.findOne({
      where: { number: req.body.number }
    });
    if (findTypeByNumber) {
      throw new Error("validationError: тип с таким номером уже существует");
    }

    if (req.body.note) options.note = req.body.note;

    const type = await db.Type.findOrCreate({
      where: options
    });

    res.json({ type });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateType(req, res) {
  console.log("function updateType");
  try {
    const type = await db.Type.findByPk(req.params.id);
    if (type == null) {
      throw new Error("validationError: Type by this id not found!");
    }

    if (req.body.name && type.name != req.body.name) {
      //check name
      //do not let the type to be updated with a name which already exists
      const findTypeByName = await db.Type.findOne({
        where: { name: req.body.name }
      });
      if (findTypeByName) {
        throw new Error(
          "validationError: тип с таким названием уже существует!"
        );
      }
      type.name = req.body.name;
    }

    if (req.body.number && type.number != req.body.number) {
      const findTypeByNumber = await db.Type.findOne({
        where: { number: req.body.number }
      });
      if (findTypeByNumber) {
        throw new Error("validationError: тип с таким номером уже существует!");
      }
      type.number = req.body.number;
    }

    if (req.body.note) type.note = req.body.note;

    await type.save();
    res.json({ type });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteType(req, res) {
  console.log("function deleteTypes");
  try {
    const type = await db.Type.findByPk(req.params.id);
    if (!type) {
      throw new Error("validationError: Type by this id not found!");
    }
    await type.destroy();
    res.json({ massage: `type with id ${type.id} deleted` });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getTypes,
  getTypeById,
  createType,
  updateType,
  deleteType
};
