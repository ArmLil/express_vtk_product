"use strict";

let db = require("../models");

async function getNamings(req, res) {
  console.log("function getNamings");
  try {
    let namings = await db.Naming.findAndCountAll();
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
      return res.status(400).send("Bad Request, name required");
    }

    const findNamingByName = await db.Naming.findOne({
      where: { name: req.body.name }
    });
    if (findNamingByName) {
      throw new Error(
        "validationError: наименование с таким названием уже существует"
      );
    }

    if (req.body.note) options.note = req.body.note;

    if (req.body.typeId) {
      let type = await db.Type.findByPk(req.body.typeId);
      if (type == null) {
        throw new Error("validationError: тип по этим данным не существует");
      }
      options.typeId = req.body.typeId;
    }

    const naming = await db.Naming.findOrCreate({
      where: options
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

    if (req.body.name && naming.name != req.body.name) {
      //check name
      //do not let the name to be updated with a name which already exists
      const findNamingByName = await db.Naming.findOne({
        where: { name: req.body.name }
      });
      if (findNamingByName) {
        throw new Error(
          "validationError: наименование с таким названием уже существует!"
        );
      }
      naming.name = req.body.name;
    }

    if (req.body.note) naming.note = req.body.note;
    if (req.body.typeId) {
      let type = await db.Type.findByPk(req.body.typeId);
      if (type == null) {
        throw new Error("validationError: тип по этим данным не существует");
      }
      naming.typeId = req.body.typeId;
    }

    await naming.save();
    res.json({ naming });
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
