const express = require("express");
const router = express.Router();

const {Movie, validate} = require("../database/Movie");
const {Genre} = require("../database/Genre");
const mongodb = require("mongoose");
const auth = require("../middleware/auth");


router.get("/", async (req, res)=>{
    const movies = await Movie.find().sort("name");
    res.send(movies);
});

router.post("/", auth, async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send("Invalid Genre...");

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRenatalRate: req.body.dailyRenatalRate
    })

    movie = await movie.save();
});

module.exports = router;