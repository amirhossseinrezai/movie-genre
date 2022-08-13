const mongodb = require("mongoose");
const Joi = require("joi");
const {genreSchema} = require("./Genre");

const Movie = mongodb.model("Movie", new mongodb.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        min: 0,
        max: 255
    }

}));

function validateMovie(movie) {

    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        genre: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;