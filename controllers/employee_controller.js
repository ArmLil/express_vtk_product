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

    const findEmployeeByName = await db.Employee.findOne({
      where: { name: req.body.name }
    });
    if (findEmployeeByName) {
      throw new Error(
        "validationError: сотрудник с таким названием уже существует"
      );
    }

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
  console.log("function updateEmployee");
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    if (employee == null)
      throw new Error("validationError: Employee by this id not found!");

    if (req.body.name && employee.name != req.body.name) {
      //check name
      //do not let the employee to be updated with a name which already exists
      const findEmployeeByName = await db.Employee.findOne({
        where: { name: req.body.name }
      });
      if (employee.name !== req.body.name && findEmployeeByName) {
        throw new Error(
          "validationError: сщтрудник с таким названием уже существует!"
        );
      }
      employee.name = req.body.name;
    }
    if (req.body.note) employee.note = req.body.note;

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
