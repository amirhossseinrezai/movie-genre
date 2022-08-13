const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();

const auth = require("../middleware/auth");
const {User, validate} = require("../database/User");

router.get("/me", auth, async (req, res)=>{
    const user = await User.findById(req.user._id).select("-password");
    if(!user) return res.status(400).send("the user doesnt exist in database");
    res.send(user);
})
router.post("/", async (req, res)=>{
    const { error } = validate(req.body);

    if(error) return res.status(400).send("Invalid User...");

    let user = User.findOne({email: req.body.email})
        .then(async result=> {

             if(!result){

                user = new User(_.pick(req.body, ["name", "email", "password"]));
                bcrypt.genSalt(10)
                .then(res=>{

                    bcrypt.hash(user.password, res)
                    .then(result=> {

                        console.log("successfuly hashed..")
                        user.password = result;
                        user.save();
                    })
                    .catch(error=> console.log(new Error(error)));
                })
                .catch(err=> console.log(new Error(err)));

                await user.save();
                const token = user.generateAuthToken();
                res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
             }else{
                 return res.status(400).send("the user is already exist");
             }
            })
        .catch(err => { console.log(new Error(err)); return;});



});

module.exports = router;