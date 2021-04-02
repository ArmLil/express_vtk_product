"use strict";

module.exports = app => {
  const express = require("express");
  const router = require("express").Router();
  const types = require("../controllers/type_controller");
  const locations = require("../controllers/location_controller");
  const namings = require("../controllers/naming_controller");
  const employees = require("../controllers/employee_controller");
  const products = require("../controllers/product_controller");
  const users = require("../controllers/user_controller");
  const auth = require("../controllers/auth_controller");

  router.get("/", function(req, res) {
    res.json({
      message: "RESTapi service"
    });
  });

  router.get("/types", types.getTypes);
  router.get("/types/:id", types.getTypeById);
  router.post("/types", types.createType);
  router.put("/types/:id", types.updateType);
  router.delete("/types/:id", types.deleteType);

  router.get("/locations", locations.getLocations);
  router.get("/locations/:id", locations.getLocationById);
  router.post("/locations", locations.createLocation);
  router.put("/locations/:id", locations.updateLocation);
  router.delete("/locations/:id", locations.deleteLocation);

  router.get("/namings", namings.getNamings);
  router.get("/namings/:id", namings.getNamingById);
  router.post("/namings", namings.createNaming);
  router.put("/namings/:id", namings.updateNaming);
  router.delete("/namings/:id", namings.deleteNaming);

  router.get("/employees", employees.getEmployees);
  router.get("/employees/:id", employees.getEmployeeById);
  router.post("/employees", employees.createEmployee);
  router.put("/employees/:id", employees.updateEmployee);
  router.delete("/employees/:id", employees.deleteEmployee);

  router.get("/products", products.getProducts);
  router.get("/products/:id", products.getProductById);
  router.post("/products", products.createProduct);
  router.put("/products/:id", products.updateProduct);
  router.delete("/products/:id", products.deleteProduct);

  router.get("/users", auth.checkauth, users.getUsers);
  router.get("/userById/:id", auth.checkauth, users.getUserById);
  // router.post("/users", auth.checkauth, users.createUser);
  // router.put("/users/:id", auth.checkauth, users.updateUser);
  // router.delete("/users/:id", auth.checkauth, users.deleteUser);

  router.post("/register", auth.register);
  router.post("/login", auth.login);
  router.get("/confirmation/:token", auth.emailConfirmation, auth.showHome);

  return router;
};
