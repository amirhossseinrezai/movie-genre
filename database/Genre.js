const mongodb = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongodb.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});
const Genre = mongodb.model("Genre", genreSchema);

function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });
    return schema.validate(genre);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;