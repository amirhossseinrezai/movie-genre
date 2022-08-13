const auth = require("../middleware/auth");
const express = require("express");
const mongodb = require("mongoose");
const {Genre, validate} = require("../database/Genre");
const admin = require("../middleware/admin");
const res = require("express/lib/response");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

router.get("/", async (req, res)=>{
    const genres = await Genre.find().sort("name");
    if(!genres) return res.status(404).send("this genre doesnt exist in database");
    res.send(genres);
});

router.get("/:id", async (req, res)=>{
    if(! mongodb.Types.ObjectId.isValid(req.params.id)){
        return res.status(404).send('invalid Id');
    }
    const genres = await Genre.findById(req.params.id);
    if(!genres) return res.status(404).send("this genre doesnt exist in database");
    res.send(genres);
});

router.post("/", auth, async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findOne({name: req.body.name});
    if(genre) return res.status(401).send("the genre type is already exist");

    let newGenre = new Genre({
        name: req.body.name
    });

    await newGenre.save();
    res.send(newGenre);
});
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true
    });

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
  });

router.delete("/:id", [auth, admin, validateObjectId], async (req, res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(404).send("the genre doesnt exist");

    res.send(genre);
});

module.exports = router;