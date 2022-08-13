const request = require('supertest');
const {Genre} = require('../../database/Genre');
const {User} = require('../../database/User');
const mongodb = require('mongoose');

let server;

describe('/api/genre', ()=>{
    beforeEach(()=>{
        server = require('../../app');
    });
    afterEach(async ()=>{
        await server.close();
        await Genre.deleteMany({});
    });
    describe('Get /', ()=>{
        it('should return all genres', async()=>{
            const genre = new Genre(
                {name: 'genre1'}
            );
            await genre.save();
            const result = await request(server).get('/api/genres');
            expect(result.status).toBe(200);
            expect(result.body.length).toBe(1);
            expect(result.body.some(g=> g.name === 'genre1')).toBeTruthy();
        });
    });
    describe('Get /:id', ()=>{
        beforeEach(()=>{
            server = require('../../app');
        });
        afterEach(async ()=>{
            server.close();
            await Genre.deleteMany({});
        });
        it('should return a genre by giving Id', async ()=>{
            const genre = {_id: new mongodb.Types.ObjectId(mongodb.Types.ObjectId()),name: 'genre1'};
            const genreAdded = new Genre(genre);
            await genreAdded.save();
            const result = await request(server).get('/api/genres/'+genre._id);
            expect(result.body).toMatchObject(genre);
        });
        it('should return 404 error', async ()=>{
            const result = await request(server).get('/api/genres/'+1);
            expect(result.status).toBe(404);
        });
    });
    describe('Post /', ()=>{
        let token;
        let name;
        async function exec() {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name});
        }
        beforeEach(()=>{
            token = new User().generateAuthToken();
            name = 'genre1';
        })
        it('should return 401 if client is not logged in', async ()=>{
            token = '';
            const result = await exec();
            expect(result.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 char', async ()=>{
            name = '1234';
            const result = await exec();
            expect(result.status).toBe(400);
        });
        it('should save the genre if it is valid', async ()=>{
            const result = await exec();
            const genre = await Genre.find({name: 'genre1'});
            expect(result.status).toBe(200);
            expect(genre).not.toBeNull();
        });
        it('should return genre if it is exist', async ()=>{
            const result = await exec();
            expect(result.body).toHaveProperty('_id');
            expect(result.body).toHaveProperty('name', 'genre1');
        });
    });
    describe('put /:id', ()=>{
        let token;
        let id;
        let newName;
        const exec = ()=>{
            return request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({name:newName});
        };
        beforeEach(async()=>{
            token = new User().generateAuthToken();
            genre = await Genre({name: 'genre1'})
            await genre.save();
            id = genre._id;
            newName = 'updateName';
        });
        it('should return 401 if user didnt logged in', async ()=>{
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 if invalid genre has pass', async()=>{
            newName='genr';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 404 if id doesnt exist in db', async()=>{
            id=''
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return 404 if  genre with the given id was not found', async()=>{
            id = new mongodb.Types.ObjectId(mongodb.Types.ObjectId());
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return 400 if genre is more than 50 characters', async()=>{
            newName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should update genre with input', async()=>{
            await exec();
            const exist = await Genre.findById(genre._id);
            expect(exist.name).toMatch(newName);
        });
        it('should send genre if it is valid', async()=>{
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        });
    });
    describe('delete /', ()=>{
        let token;
        let id;
        beforeEach(async()=>{
            token = new User({isAdmin: true}).generateAuthToken();
            const genre = new Genre({name: 'genre1'});
            await genre.save();
            id = genre._id;
        });
        const exec = ()=>{
            return request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send();
        }
        it('should return 401 that client is logged in', async ()=>{
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 403 if user is not admin', async()=>{
            token = new User().generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });
        it('should return 404 if the given id wasnt found', async ()=>{
            id = new mongodb.Types.ObjectId(mongodb.Types.ObjectId());
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return 404 if the given id wasnt found', async ()=>{
            id = '122';
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should delete the genre successfuly', async ()=>{
            await exec();
            const genre = await Genre.findById(id);
            expect(genre).toBeNull();
        });
        it('should return the removed genre', async ()=>{
            const res = await exec();
            expect(res.body).toHaveProperty('_id', id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });
});



