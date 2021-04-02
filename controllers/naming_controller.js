"use strict";

let db = require("../models");

async function getNamings(req, res) {
  console.log("function getNamings");
  try {
    let namings = await db.Naming.findAndCountAll({
      include: [
        {
          model: db.Type,
          as: "type"
        }
      ]
    });
    let count = namings.count;

    res.json({
      namings,
      count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getNamingById(req, res) {
  console.log("function getNamingById");
  try {
    let naming = await db.Naming.findByPk(req.params.id);
    if (naming == null) {
      throw new Error("validationError: Naming with this id not found!");
    }
    res.json({ naming });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createNaming(req, res) {
  console.log("function createNaming");
  try {
    let options = {};

    if (req.body.name) {
      options.name = req.body.name;
    } else {
      return res.status(400).send({ "Bad Request": "name required" });
    }

    if (req.body.decimalNumber) {
      options.decimalNumber = req.body.decimalNumber;

      const findNamingByNameDecNumber = await db.Naming.findOne({
        where: {
          name: req.body.name,
          decimalNumber: req.body.decimalNumber
        }
      });

      if (findNamingByNameDecNumber) {
        throw new Error(
          "validationError: наименование с таким названием и децимальным номером уже существует"
        );
      }
    }
    if (req.body.note) options.note = req.body.note;
    if (req.body.type) {
      let type = await db.Type.findOne({
        where: {
          name: req.body.type
        }
      });
      if (type == null) {
        throw new Error("validationError: тип по этим данным не существует");
      }
      options.typeId = type.id;
    } else {
      return res.status(400).send({ "Bad Request": "type required" });
    }

    const _naming = await db.Naming.findOrCreate({
      where: options
    });
    const naming = await db.Naming.findOne({
      where: { id: _naming[0].dataValues.id },
      include: [
        {
          model: db.Type,
          as: "type"
        }
      ]
    });
    res.json({ naming });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateNaming(req, res) {
  console.log("function updateNaming");
  try {
    const naming = await db.Naming.findByPk(req.params.id);
    if (naming == null) {
      throw new Error("validationError: Naming by this id not found!");
    }

    if (
      (req.body.name && naming.name != req.body.name) ||
      (req.body.decimalNumber && naming.decimalNumber != req.body.decimalNumber)
    ) {
      //check name, decimalNumber
      //do not let the name, decimalNumber to be updated with a name, decimalNumber which already exist
      const findNamingByNameDecNumber = await db.Naming.findOne({
        where: {
          name: req.body.name,
          decimalNumber: req.body.decimalNumber
        }
      });

      if (findNamingByNameDecNumber) {
        throw new Error(
          "validationError: наименование с таким названием и децимальным номером уже существует!"
        );
      }
      naming.name = req.body.name;
      naming.decimalNumber = req.body.decimalNumber;
    }

    if (req.body.note) naming.note = req.body.note;
    if (req.body.type) {
      let type = await db.Type.findOne({ where: { name: req.body.type } });

      if (type == null) {
        throw new Error("validationError: тип по этим данным не существует");
      }
      naming.typeId = type.id;
    }

    await naming.save();
    const _naming = await db.Naming.findOne({
      where: { id: naming.id },
      include: [
        {
          model: db.Type,
          as: "type"
        }
      ]
    });
    res.json({ naming: _naming });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteNaming(req, res) {
  console.log("function deleteNamings");
  try {
    const naming = await db.Naming.findByPk(req.params.id);
    if (!naming) {
      throw new Error("validationError: Naming by this id not found!");
    }
    await naming.destroy();
    res.json({ massage: `naming with id ${naming.id} deleted` });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getNamings,
  getNamingById,
  createNaming,
  updateNaming,
  deleteNaming
};
