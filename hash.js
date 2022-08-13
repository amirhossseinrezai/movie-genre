const bcrypt = require("bcrypt");

const salt = bcrypt.genSalt(10)
    .then(res=> {
        bcrypt.hash('1234', res)
        .then(result=> console.log(result))
        .catch(err=> console.log(new Error(err)));
    })
    .catch(err=> console.log(new Error(err)));
