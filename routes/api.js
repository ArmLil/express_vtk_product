"use strict";

module.exports = app => {
  const express = require("express");
  const router = require("express").Router();
  const types = require("../controllers/type_controller");
  const locations = require("../controllers/location_controller");
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
