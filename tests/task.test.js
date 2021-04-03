const request = require('supertest')
const app = require('../src/app')    // allows us to get express application w/out calling listen (w/out needing server running)
const Task = require('../src/models/task')
const {userOneId, userOne, userTwo, userTwoId, 
        taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db') 

/* runs before every test in the environment */
beforeEach(setupDatabase)

test('Should create Task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   // server will confirm that this token is valid;  userOne from db.js
        .send({
            description: 'from Test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()   
    expect(task.completed).toEqual(false)   // this is default value
})

test('Get Tasks for User Test', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   // server will confirm that this token is valid
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('FAIL Test -- Delete Task One (user 1 task) from User Two', async () => {
    const response = await request(app)
        .delete('/tasks/'+taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)   // server will confirm that this token is valid
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)  // or could pass forward taskOneId from db.js 
    expect(task).not.toBeNull()   // checking that task is still in database (not null);  see https://jestjs.io/docs/en/getting-started API Reference Expect
})

// Extra Test Ideas (to be developed) can be found at links.mead.io/extratests   [pasted below] 

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks