"use strict";

let db = require("../models");

async function getLocations(req, res) {
  console.log("function getLocations");
  try {
    let locations = await db.Location.findAndCountAll();
    let count = locations.count;

    res.json({
      locations,
      count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getLocationById(req, res) {
  console.log("function getLocationById");
  try {
    let location = await db.Location.findByPk(req.params.id);
    if (location == null) {
      throw new Error("validationError: Location with this id not found!");
    }
    res.json({ location });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createLocation(req, res) {
  console.log("function createLocation");
  try {
    let options = {};
    console.log(req.body.number);
    if (req.body.number) {
      console.log("if if");
      let _location = await db.Location.findOne({
        where: { number: req.body.number }
      });
      if (_location) {
        throw new Error("Место производства с таким номером уже существует.");
      }
      options.number = req.body.number;
    } else {
      const locationsByNumbers = await db.Location.findAndCountAll();
      if (locationsByNumbers.rows.length == 0) {
        options.number = "01";
      } else {
        let locationsByNumbersArr = locationsByNumbers.rows.map((loc, i) => {
          return Number(loc.dataValues.number);
        });
        locationsByNumbersArr.sort(function(a, b) {
          return a - b;
        });
        const maxNumber =
          locationsByNumbersArr[locationsByNumbersArr.length - 1];
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
    if (req.body.note) options.note = req.body.note;

    const findLocationByName = await db.Location.findOne({
      where: { name: req.body.name }
    });
    if (findLocationByName) {
      throw new Error("Место производства с таким названием уже существует");
    }

    if (req.body.note) options.note = req.body.note;

    const location = await db.Location.findOrCreate({
      where: options
    });

    res.json({ location });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateLocation(req, res) {
  console.log("function updateLocation");
  try {
    const location = await db.Location.findByPk(req.params.id);
    if (location == null) {
      throw new Error("validationError: Location by this id not found!");
    }

    if (req.body.name && location.name != req.body.name) {
      //check name
      //do not let the location to be updated with a name which already exists
      const findLocationByName = await db.Location.findOne({
        where: { name: req.body.name }
      });
      if (findLocationByName) {
        throw new Error("Тип с таким названием уже существует!");
      }
      location.name = req.body.name;
    }

    if (req.body.number && location.number != req.body.number) {
      const findLocationByNumber = await db.Location.findOne({
        where: { number: req.body.number }
      });
      if (findLocationByNumber) {
        throw new Error("Тип с таким номером уже существует!");
      }
      location.number = req.body.number;
    }

    if (req.body.note) location.note = req.body.note;

    await location.save();
    res.json({ location });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteLocation(req, res) {
  console.log("function deleteLocations");
  try {
    const location = await db.Location.findByPk(req.params.id);
    if (!location) {
      throw new Error("validationError: Location by this id not found!");
    }
    await location.destroy();
    res.json({ massage: `location with id ${location.id} deleted` });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
};
