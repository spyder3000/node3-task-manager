const request = require('supertest')
const app = require('../src/app')    // allows us to get express application w/out calling listen (w/out needing server running)
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase } = require('./fixtures/db') 

/* runs before every test in the environment */
beforeEach(setupDatabase)

/*afterEach(() => {   console.log('afterEach') })*/

test('Signup a New User TEST', async () => {  
    const response = await request(app).post('/users').send({    // 1st param is the express app;  then need to include HTTP method & url
        name: 'Spyder2', 
        email: 'sypder2@spyder.com', 
        password: 'mypass8787!'
    }).expect(201)    

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()   // checking that user is not null;  see https://jestjs.io/docs/en/getting-started API Reference Expect

    // Assertions about the response 
    expect(response.body).toMatchObject({   // checks that the objects we list match up exactly 
        user: {
            name: 'Spyder2', 
            email: 'sypder2@spyder.com', 
        }, 
        token: user.tokens[0].token   // token matches the token we stored on the database
    }) 
    expect(user.password).not.toBe('mypass8787!')  // test that pwd is not stored as the string entered
})

test('Login Existing user Test', async () => {  
    const response = await request(app).post('/users/login').send({    // 1st param is the express app;  then need to include HTTP method & url
        email: userOne.email, 
        password: userOne.password
    }).expect(200)    

    const user = await User.findById(userOneId)  // could also have used response.body.user._id instead of userOneId)
    expect(user).not.toBeNull()   // checking that user is not null;  see https://jestjs.io/docs/en/getting-started API Reference Expect

    // Assertions about the response 
    expect(response.body).toMatchObject({   // checks that the objects we list match up exactly 
        token: user.tokens[1].token   // 1st token was when we created user;  2nd token is when we logged in
    }) 
    expect(response.body.token).toBe(user.tokens[1].token);   // same as prev logic 
})

test('Login FAIL test for NonExisting user', async () => {  
    await request(app).post('/users/login').send({    // 1st param is the express app;  then need to include HTTP method & url
        email: 'asdfsa', 
        password: userOne.password
    }).expect(400)    
})

test('Get Profile for User Test', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   // server will confirm that this token is valid
    .send()
    .expect(200)
})

test('FAIL Test -- Get Profile for Unauthenticated User', async () => {
    await request(app)
    .get('/users/me')
 //   .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   // server will confirm that this token is valid
    .send()
    .expect(401)
})

test('Delete Account for User Test', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   // server will confirm that this token is valid
    .send()
    .expect(200)

    const user = await User.findById(userOneId)  
    expect(user).toBeNull()   // checking that user is null (e.g. deleted);  see https://jestjs.io/docs/en/getting-started API Reference Expect
})

test('FAIL Test for Delete Account for Unauthenticated User', async () => {
    await request(app)
    .delete('/users/me')
  //  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   // server will confirm that this token is valid
    .send()
    .expect(401)
})

test('Test upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')   // 1st arg is the form field we're trying to set;  2nd is path to the file 
        .expect(200)
    const user = await User.findById(userOneId); 
    //expect({}).toBe({})  // this fails;  .toBe uses === operator;  objects are only === if they are the same object in memory
    // expect({}).toEqual({})  // this succeeds;  compares properties on object & compares those
    expect(user.avatar).toEqual(expect.any(Buffer))  // if avatar = any Buffer then successful upload
})


test('Update Profile for User Test', async () => {
    const response = await request(app)
        .patch('/users/me')  // 1st param is the express app;  then need to include HTTP method & url
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   // server will confirm that this token is valid
        .send({    
            name: 'Lebron', 
            email: 'lebron@lebron.com'
    }).expect(200)  
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Lebron')    // verify new value is as expected
})

test('FAIL test -- Update Invalid Field for User', async () => {
    const response = await request(app)
        .patch('/users/me')     // 1st param is the express app;  then need to include HTTP method & url
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   // server will confirm that this token is valid
        .send({    
            location: 'kansas'   // location does not exist 
    }).expect(400)    
})
