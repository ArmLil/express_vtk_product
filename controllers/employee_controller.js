"use strict";

let db = require("../models");

async function getEmployees(req, res) {
  console.log("function getEmployees");
  try {
    let employees = await db.Employee.findAndCountAll();
    let count = employees.count;

    res.json({
      employees,
      count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getEmployeeById(req, res) {
  console.log("function getEmployeeById");
  try {
    let employee = await db.Employee.findByPk(req.params.id);
    console.log(employee);
    if (employee == null) {
      throw new Error("validationError: Employee with this id not found!");
    }
    res.json({ employee });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createEmployee(req, res) {
  console.log("function createEmployee");
  try {
    let options = {};

    if (req.body.name) {
      options.name = req.body.name;
    } else {
      return res.status(400).send({ "Bad Request": "name required" });
    }
    if (req.body.secondName) {
      options.secondName = req.body.secondName;
    } else {
      return res.status(400).send({ "Bad Request": "secondName required" });
    }

    if (req.body.fatherName) options.fatherName = req.body.fatherName;
    if (req.body.note) options.note = req.body.note;

    const employee = await db.Employee.findOrCreate({
      where: options
    });

    res.json({ employee });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateEmployee(req, res) {
  console.log("function updateEmployee", req.body);
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    if (employee == null)
      throw new Error("validationError: Employee by this id not found!");

    if (req.body.name && employee.name != req.body.name) {
      employee.name = req.body.name;
    }
    if (req.body.secondName && employee.secondName != req.body.secondName) {
      employee.secondName = req.body.secondName;
    }
    if (req.body.fatherName && employee.fatherName != req.body.fatherName) {
      employee.fatherName = req.body.fatherName;
    }
    if (req.body.note && employee.note != req.body.note) {
      employee.note = req.body.note;
    }
    console.log({ employee });
    await employee.save();
    res.json({ employee });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteEmployee(req, res) {
  console.log("function deleteEmployees");
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    if (!employee) {
      throw new Error("validationError: Employee by this id not found!");
    }
    await employee.destroy();
    res.json({ massage: `employee with id ${employee.id} deleted` });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
