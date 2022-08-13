const { User } = require('../../database/User');
const auth = require('../../middleware/auth');

describe('auth middleware unit', ()=>{

    it('should return 400 if no token has provided', ()=>{
        const token = new User().generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {}
        const next = jest.fn();
        auth(req, res, next);
        expect(req.user).toBeDefined();
    });
});