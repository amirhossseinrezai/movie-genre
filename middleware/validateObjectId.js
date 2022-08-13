const mongoDb = require('mongoose');
module.exports = (req, res, next)=>{
    if(!mongoDb.Types.ObjectId.isValid(req.params.id)){
        return res.status(404).send('Invalid Id');
    }
    next();
};