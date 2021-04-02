"use strict";

let db = require("../models");

async function getProducts(req, res) {
  console.log("function getProducts");
  try {
    let options = {};

    if (req.query.bookingDate) options.bookingDay = req.query.bookingDate;
    if (req.query.year) options.year = req.query.year;
    if (req.query.number) options.number = req.query.number;
    if (req.query.namingId) options.namingId = req.query.namingId;
    if (req.query.typeId) options.typeId = req.query.typeId;
    if (req.query.employeeId) options.employeeId = req.query.employeeId;
    if (req.query.locationId) options.locationId = req.query.locationId;
    if (req.query.serialNumber) options.serialNumber = req.query.serialNumber;

    let products = await db.Product.findAndCountAll({
      where: options,
      include: [
        {
          model: db.Type,
          as: "type"
        },
        {
          model: db.Naming,
          as: "naming"
        },
        {
          model: db.Location,
          as: "location"
        },
        {
          model: db.Employee,
          as: "employee"
        }
      ]
    });
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
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  today = dd + "." + mm + "." + yyyy;
  try {
    let options = {};

    // define options bookingDate
    options.bookingDate = today;

    // define options year
    options.year = yyyy.toString().slice(-2);

    // define options number
    if (req.body.number) {
      let _product = await db.Product.findOne({
        where: { number: req.body.number }
      });
      if (_product) {
        throw new Error("Изделие с таким номером уже существует.");
      }
      options.number = req.body.number;
    } else {
      const products = await db.Product.findAndCountAll();
      let number = 1;
      if (products.rows.length > 0) {
        let byNumber = products.rows.map((product, i) => {
          return product.number;
        });
        byNumber.sort(function(a, b) {
          return a - b;
        });
        number = byNumber[byNumber.length - 1] + 1;
      }
      options.number = number;
    }

    // define options namingId typeId decimalNumber
    if (req.body.namingId) {
      const naming = await db.Naming.findByPk(req.body.namingId);
      if (naming == null) {
        throw new Error("validationError: Naming with this id not found!");
      } else {
        if (naming.typeId) options.typeId = naming.typeId;
        if (naming.decimalNumber) options.decimalNumber = naming.decimalNumber;
      }

      options.namingId = req.body.namingId;
    } else {
      return res.status(400).send({ "Bad Request": "namingId required" });
    }

    // define options employeeId
    if (req.body.employeeId) {
      const employee = db.Employee.findByPk(req.body.employeeId);
      if (employee == null) {
        throw new Error("validationError: employee with this id not found!");
      }
      options.employeeId = req.body.employeeId;
    }

    // define options locationId
    if (req.body.locationId) {
      const location = db.Location.findByPk(req.body.locationId);
      if (location == null) {
        throw new Error("validationError: location with this id not found!");
      }
      options.locationId = req.body.locationId;
    } else {
      return res.status(400).send({ "Bad Request": "locationId required" });
    }

    // define options noteId
    if (req.body.noteId) {
      const note = db.Note.findByPk(req.body.noteId);
      if (note == null) {
        throw new Error("validationError: note with this id not found!");
      }
      options.noteId = req.body.noteId;
    }

    // define options serialNumber
    const productsByYearLocType = await db.Product.findAndCountAll({
      where: {
        year: options.year,
        locationId: options.locationId,
        typeId: options.typeId
      }
    });
    if (productsByYearLocType.rows.length == 0) {
      options.serialNumber = "001";
    } else {
      let productsSerNumberArr = productsByYearLocType.rows.map(
        (product, i) => {
          return Number(product.dataValues.serialNumber);
        }
      );
      productsSerNumberArr.sort(function(a, b) {
        return a - b;
      });
      const maxSerialNumber =
        productsSerNumberArr[productsSerNumberArr.length - 1];
      let serialNumber = ("000" + (+maxSerialNumber + 1)).slice(-3);
      options.serialNumber = serialNumber;
    }

    // save product
    const _product = await db.Product.findOrCreate({
      where: options
    });
    const _productJSON = JSON.parse(JSON.stringify(_product[0]));

    let product = await db.Product.findOne({
      where: { id: _productJSON.id },
      include: [
        {
          model: db.Type,
          as: "type"
        },
        {
          model: db.Naming,
          as: "naming"
        },
        {
          model: db.Location,
          as: "location"
        },
        {
          model: db.Note,
          as: "note"
        },
        {
          model: db.Employee,
          as: "employee"
        }
      ]
    });
    product = JSON.parse(JSON.stringify(product));
    if (product.type) {
      product.typeNumber = product.type.number;
      product.type = product.type.name;
    }
    if (product.location) {
      product.locationNumber = product.location.number;
      product.location = product.location.name;
    }

    if (product.naming) {
      product.naming = product.naming.name;
      if (product.naming.decimalNumber) {
        product.decimalNumber = product.naming.decimalNumber;
      }
    }
    if (product.note) product.note = product.note.name;
    if (product.employee) product.employee = product.employee.name;
    console.log({ product });
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

    if (req.body.number) {
      product.number = req.body.number;
    }

    if (req.body.namingId) {
      const findNaming = await db.Naming.findByPk(req.body.namingId);
      if (findNaming == null) {
        throw new Error("validationError: Naming with this id not found!");
      } else {
        if (findNaming.typeId) product.typeId = findNaming.typeId;
      }
      product.namingId = req.body.namingId;
    }

    if (req.body.decimalNumberId) {
      const decimalNumber = db.DecimalNumber.findByPk(req.body.decimalNumberId);
      if (decimalNumber == null) {
        throw new Error(
          "validationError: decimalNumber with this id not found!"
        );
      }
      product.decimalNumberId = req.body.decimalNumberId;
    }

    if (req.body.bookingDate) product.bookingDate = req.body.bookingDate;

    if (req.body.year) product.year = req.body.year;

    if (req.body.locationId) {
      const location = db.Location.findByPk(req.body.locationId);
      if (location == null) {
        throw new Error("validationError: location with this id not found!");
      }
      product.locationId = req.body.locationId;
    }

    if (req.body.serialNumber) product.serialNumber = req.body.serialNumber;

    if (req.body.noteId) {
      const note = db.Note.findByPk(req.body.noteId);
      if (note == null) {
        throw new Error("validationError: note with this id not found!");
      }
      product.noteId = req.body.noteId;
    }

    if (req.body.employeeId) {
      const employee = db.Employee.findByPk(req.body.employeeId);
      if (employee == null) {
        throw new Error("validationError: employee with this id not found!");
      }
      product.employeeId = req.body.employeeId;
    }

    await product.save();

    let _product = await db.Product.findOne({
      where: { id: product.id },
      include: [
        {
          model: db.Type,
          as: "type"
        },
        {
          model: db.Naming,
          as: "naming"
        },
        {
          model: db.DecimalNumber,
          as: "decimalNumber"
        },
        {
          model: db.Location,
          as: "location"
        },
        {
          model: db.Note,
          as: "note"
        },
        {
          model: db.Employee,
          as: "employee"
        }
      ]
    });
    _product = JSON.parse(JSON.stringify(_product));

    if (_product.type) {
      _product.typeNumber = _product.type.number;
      _product.type = _product.type.name;
    }
    if (_product.location) {
      _product.locationNumber = _product.location.number;
      _product.location = _product.location.name;
    }
    if (_product.decimalNumber)
      _product.decimalNumber = _product.decimalNumber.name;
    if (_product.naming) _product.naming = _product.naming.name;
    if (_product.note) _product.note = _product.note.name;
    if (_product.employee) _product.employee = _product.employee.name;

    res.json({ product: _product });
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
