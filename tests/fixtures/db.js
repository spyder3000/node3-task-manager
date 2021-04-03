// will contain all data to set up database;  copied from user.test.js so this will be in one place (and can be accessed by task.test.js also)  

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');  
const User = require('../../src/models/user') 
const Task = require('../../src/models/task') 

const userOneId = new mongoose.Types.ObjectId();  // use in creating userOne & in adding tokens to user we create

// when userOne is created, will have an _id & a token associated with it 
const userOne = {
    _id: userOneId, 
    name: 'Ichabod Crane', 
    email: 'ichabod@ichabod.com', 
    password: 'jjjj3333!', 
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)  // token used below in requests that need auth
    }]
}

const userTwoId = new mongoose.Types.ObjectId(); 
const userTwo = {
    _id: userTwoId, 
    name: 'Elvis', 
    email: 'elvis@elvis.com', 
    password: 'abcdef22!', 
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)  // token used below in requests that need auth
    }]
}

const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
    _id: taskOneId, 
    description: 'Task One description', 
    completed: false,
    owner: userOneId   // or userOne._id which is the same
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(), 
    description: 'Task Two description', 
    completed: true,
    owner: userOne._id   // or userOne._id which is the same
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(), 
    description: 'Task Three description', 
    completed: false,
    owner: userTwoId   // or userTwo._id which is the same
}

const setupDatabase = async () => {
    await User.deleteMany()    // makes sure all Users are deleted before jest considers this done;  
    await Task.deleteMany()
    await new User(userOne).save()    // creates a new user & saves (will be used for testing login & some other) 
    await new User(userTwo).save()  
    await new Task(taskOne).save() 
    await new Task(taskTwo).save() 
    await new Task(taskThree).save() 
}

module.exports = {
    userOneId, 
    userTwoId, 
    userOne, 
    userTwo, 
    taskOne,
    taskTwo, 
    taskThree,  
    setupDatabase 
}