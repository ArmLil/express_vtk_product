"use strict";

module.exports = app => {
  const express = require("express");
  const router = require("express").Router();
  const types = require("../controllers/type_controller");
  const users = require("../controllers/user_controller");
  const auth = require("../controllers/auth_controller");

  router.get("/", function(req, res) {
    res.json({
      message: "RESTapi service"
    });
  });

  router.get("/types", auth.checkauth, types.getTypes);
  router.get("/types/:id", auth.checkauth, types.getTypeById);
  router.post("/types", auth.checkauth, types.createType);
  router.put("/types/:id", auth.checkauth, types.updateType);
  router.delete("/types/:id", auth.checkauth, types.deleteType);


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
