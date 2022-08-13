const mongodb = require("mongoose");
const Joi = require("joi");

const Customer = mongodb.model("Customer", new mongodb.Schema({
    isGold: {type: Boolean, default: false},
    name: {type: String, required: true},
    phone: {type: String, required: true}
}));

function validateCustomer(customer){
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().required(),
        phone: Joi.string().min(5).max(50).required()
    });
    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;