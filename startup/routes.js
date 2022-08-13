const express = require('express');
const movie = require("../router/moives");
const genre = require("../router/genre");
const rental = require("../router/rentals");
const user = require("../router/users");
const auth = require("../router/auth");
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use("/api/movies", movie);
    app.use("/api/genres", genre);
    app.use("/api/rentals", rental);
    app.use("/api/users", user);
    app.use("/api/auth", auth);
    app.use(error);
}