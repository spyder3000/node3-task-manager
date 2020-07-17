/* the starting point for our application  */
const express = require('express'); 
require('./db/mongoose')  // will connect to mongoose
const User = require('./models/user');      // creates User Model 
const Task = require('./models/task');      // creates Task Model 

const app = express()
const port = process.env.PORT || 3000;    // process.env.PORT will come from Heroku for production

/* setup express to automatically parse json */
app.use(express.json()); 

/*  Send POST data via HTTP Request (from Postman) -- e.g. localhost:3000/users;  clicking Send on Postman w/ valid 'body' data 
        will trigger this to run;  returns json data on Postman;  data save to db as found on Robo 3T */ 
app.post('/users', (req,res) => {
    //console.log(req.body); 
    //res.send('testing'); 
    const user = new User(req.body); 
    user.save().then(() => {
        res.status(201);   // 201 is Created;  200 is OK 
        res.send(user)
    }).catch((e) => {   /* e.g. if pwd is too short;  default would still return status code of 200; see https://httpstatuses.com/  */
        res.status(400);  // bad request;  
        res.send(e)
    }); 
})

/* URL -- https://mongoosejs.com/docs/queries.html - e.g. for Model.find(), Model.updateMany(), Model.deleteOne(), etc */
/*  Send GET data via HTTP request to get all users (e.g. from Postman) -- e.g. localhost:3000/users/  */
app.get('/users', (req, res) => {
    User.find({}).then((users) => {  // empty object will return all users 
        res.send(users); 
    }).catch((e) => {
        res.status(500).send();  // 500 is internal server error
    })  
})

/*  Send GET data via HTTP request to get ONE users (e.g. from Postman) using route parameters (:id) -- e.g. localhost:3000/users/98sxx...;  */
app.get('/users/:id', (req, res) => {
    const _id = req.params.id;  
    console.log(req.params); 
    User.findById(_id).then((user) => {  // empty object will return all users 
        if (!user) {
            return res.status(404).send();   // 404 is Record Not Found (id not found); note: this doesn't work, it falls to 500 error below
        }
        res.send(user);   // success will return w/ default of 200 of OK & user object 
    }).catch((e) => {
        res.status(500).send();  // 500 is internal server error
    }) 
})

/*  Send POST data via HTTP Request (from Postman) -- e.g. localhost:3000/tasks;  clicking Send on Postman w/ valid 'body' data 
        will trigger this to run;  returns json data on Postman;  data save to db as found on Robo 3T */ 
app.post('/tasks', (req,res) => {
    const task = new Task(req.body); 
    task.save().then(() => {
        res.status(201).send(task);  // 201 is Created;  200 is OK
    }).catch((e) => {   /* e.g. if pwd is too short;  default would still return status code of 200; see https://httpstatuses.com/  */
        res.status(400);  // bad request;  
        res.send(e)
    }); 
})

/* URL -- https://mongoosejs.com/docs/queries.html - e.g. for Model.find(), Model.updateMany(), Model.deleteOne(), etc */
/*  Send GET data via HTTP request to get all tasks (e.g. from Postman) -- e.g. localhost:3000/tasks/  */
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {  // empty object param will return all users 
        res.send(tasks);    // will return an array of objects
    }).catch((e) => {
        res.status(500).send();  // 500 is internal server error
    })  
})

/*  Send GET data via HTTP request to get ONE task (e.g. from Postman) using route parameters (:id) -- e.g. localhost:3000/tasks/98sxx...;  */
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;  
    console.log(req.params); 
    Task.findOne({ _id: _id}).then((task) => {  // empty object will return all tasks 
        if (!task) {
            return res.status(404).send();   // 404 is Record Not Found (id not found); note: this doesn't work, it falls to 500 error below
        }
        res.send(task);   // success will return w/ default of 200 of OK & user object 
    }).catch((e) => {
        res.status(500).send();  // 500 is internal server error
    }) 
})

app.listen(port, () => {
    console.log('Server is up on port ' + port); 
})