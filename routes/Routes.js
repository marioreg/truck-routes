var express = require("express");
var app = express();
var db = require("../models");


module.exports = function (app) {


  /* Renders index route */
  app.get("/", function (req, res, next) {
    res.render("index", { msg: 'Homepage' });
  });

  /* Renders signup route */
  app.get("/signup", function (req, res, next) {
    res.render("signup", { msg: 'signup' });
  });


  /* Renders signup route */
  app.post("/signup", function (req, res, next) {
    res.render("signup", { msg: 'signup' });


  });





  /* Renders signin route */
  app.get("/signin", function (req, res, next) {
    res.render("signin", { msg: 'signin' });
  });


  /* Renders signin route */
  app.get("/dashboard", function (req, res, next) {
    res.render("dashboard", { msg: 'dasboard' });
  });











}
