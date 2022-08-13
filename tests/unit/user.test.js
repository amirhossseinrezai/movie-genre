const {User} = require('../../database/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongodb = require('mongoose');

describe('user.generateAuthToken', ()=>{
    it('should return a valid jwt', ()=>{
        const payload = {
            _id: new mongodb.Types.ObjectId(mongodb.Types.ObjectId()),
            isAdmin: true
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});