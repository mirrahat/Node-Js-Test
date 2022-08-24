const express = require("express");
const mongoose = require("mongoose");
const routes = require("./router.js");
require("dotenv").config();
const todoModel = require("./model");
var bodyParser = require("body-parser");

class App {
  uri = `mongodb+srv://${process.env.MONGODB_CLIENT_USER}:${process.env.MONGODB_CLIENT_PASS}@cluster0.9lpvp.mongodb.net/?retryWrites=true&w=majority`;
  constructor(app) {
    this.app = app;
    this.app.set("view engine", "ejs");

    mongoose.connect(this.uri);

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
    app.use(bodyParser.json({ type: "application/*+json" }));

    this.app.get("/", async (req, res) => {
      const todos = await todoModel.find({});
      res.render("index", { title: "Todo Lists", todos });
    });

    app.use(bodyParser.urlencoded({ extended: false }));

    this.app.post("/todo", async (req, res) => {
      const body = req.body;
      const todo = new todoModel(req.body);
      await todo.save();
      const todos = await todoModel.find({});

      res.redirect("/");
    });

    this.app.post("/remove/todo", async (req, res) => {
      await todoModel.deleteMany({});
      const todos = await todoModel.find({});
      res.redirect("/");
      // res.render("index", { title: "Todo Lists", todos });
    });
  }

  listen(PORT) {
    this.app.listen(PORT, () => {
      console.log(`Application is running on port ${PORT}`);
    });
  }
}

module.exports = new App(express());
