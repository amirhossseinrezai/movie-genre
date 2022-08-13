const request = require('supertest');
const { Genre } = require('../../database/Genre');
const { User } = require('../../database/User');

let server;
describe('auth middleware', ()=>{

    beforeEach(()=>{
        server = require('../../app');
    });
    afterEach(async ()=>{
        await server.close();
        await Genre.deleteMany({});
    });
    let token;
    const exec = async ()=>{
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: 'genre1'});
    };
    beforeEach(()=>{
        token = new User().generateAuthToken();
    });
    it('should return 401 if no token pass', async()=>{
        token = '';
        const result = await exec();
        expect(result.status).toBe(401);
    });
    it('should return 400 if no valid token pass', async()=>{
        token = 'a';
        const result = await exec();
        expect(result.status).toBe(400);
    });
    it('should return 200 if valid token pass', async()=>{
        const result = await exec();
        expect(result.status).toBe(200);
    });

});