const config = require("config");
const Jwt = require("jsonwebtoken");
const mongodb = require("mongoose");
const Joi = require("joi");
const userSchema = new mongodb.Schema({
    name: {
        type: String,
        required: true,
        minlength:5,
        maxlength: 70
    },
    email: {
        type: String,
        required: true,
        minlength:5,
        maxlength: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    let token = Jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"));
    return token;
}
const User = mongodb.model("User", userSchema);


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })
    return schema.validate(user);
}
module.exports.User = User;
module.exports.validate = validateUser;
