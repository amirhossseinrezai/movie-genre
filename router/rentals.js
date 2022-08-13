const express = require("express");
const router = express.Router();

const mongodb = require("mongoose");
const {Customer} = require("../database/Customer");
const {Movie} = require("../database/Movie");
const {Rental, validate} = require("../database/Rental");


router.get("/", async (req, res)=>{
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.post("/", async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send("Invalid customer...");

    const movies = await Movie.findById(req.body.movieId);
    if(!movies) return res.status(400).send("Invalid Movie...");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })
    rental = await rental.save();
    movie.numberInStock--;
    movie.save();
    res.send(rental);
});

module.exports = router;