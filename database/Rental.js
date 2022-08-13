const Joi = require("joi");
const mongodb = require("mongoose");

const Rental = mongodb.model("Rental", new mongodb.Schema({
    customer: {
        type: new mongodb.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold:{
                type: Boolean,
                default: false
            },
            phone: {
                type: Number,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongodb.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 50
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
        min: 0
    },
    rentalFee:{
        type: Number,
        min: 0
    }
}));

function validateRental(rental){
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });
    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;