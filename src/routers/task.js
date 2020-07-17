const express = require('express'); 
const Task = require('../models/task')
const router = new express.Router();   /* create a Router */

/*  Send POST data via HTTP Request (from Postman) -- e.g. localhost:3000/tasks;  clicking Send on Postman w/ valid 'body' data 
        will trigger this to run;  returns json data on Postman;  data save to db as found on Robo 3T */ 
// Async version of the same logic below */
router.post('/tasks', async (req,res) => {   // these were app.post calls when this was in index.js 
    const task = new Task(req.body); 
    try {
        await task.save();
        res.status(201).send(task);  
    } catch (e) {
        res.status(400).send(e); 
    }
})

/*router.post('/tasks', (req,res) => {
    const task = new Task(req.body); 
    task.save().then(() => {
        res.status(201).send(task);  // 201 is Created;  200 is OK
    }).catch((e) => {     // e.g. if pwd is too short;  default would still return status code of 200; see https://httpstatuses.com/  
        res.status(400);  // bad request;  
        res.send(e)
    }); 
})*/

/* URL -- https://mongoosejs.com/docs/queries.html - e.g. for Model.find(), Model.updateMany(), Model.deleteOne(), etc */
/*  Async -- Send GET data via HTTP request to get all tasks (e.g. from Postman) -- e.g. localhost:3000/tasks/  */
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});  // Task.find() returns promise
        res.send(tasks); 
    } catch (e) {
        res.status(400).send(); // 500 is internal server error
    }
})

/*  Send GET data via HTTP request to get ONE task (e.g. from Postman) using route parameters (:id) -- e.g. localhost:3000/tasks/98sxx...;  */
/*  Async/Await version of commented code below */
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;  
    //console.log(req.params); 
    try {
        // const task = await Task.findOne({ _id: _id}); 
         const task = await Task.findById(_id); 
         if (!task) {
            return res.status(404).send();   // 404 is Record Not Found (id not found); 
        }
        res.send(task);   // success will return w/ default of 200 of OK & user object          
    } catch (e) {
        res.status(500).send(); // 500 is internal server error
    }
})

/*router.get('/tasks/:id', (req, res) => {
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
})*/

/* Async -- patch to update an existing resource */
router.patch('/tasks/:id', async (req, res) => {
    // Return error to user if update is to fields that are not allowed 
    const updates = Object.keys(req.body);   // return an array of strings that are properties (properties submitted to be updated) 
    const allowedUpdates = ['description', 'completed']    // array of properties the user is allowed to update 
    const isValidOperation = updates.every((update) => {    // runs for each property in updates array
        return allowedUpdates.includes(update);   // .includes() returns a boolean 
    })
    if (!isValidOperation) return res.status(400).send( {error: 'Invalid updates!!'}); 

    try {   // req.params.id is from :id, req.body is JSON that will have field/vals to update (e.g. description), 
            //   'new' returns a new task so we'll have latest data, 
            //   runValidators to ensure the updated data is in format we're expecting     
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });  
        
        /* Logic here replaces Task.findByIdAndUpdate in line above;  this logic executed so we can utilize middleware in \src\models\task.js */
        const task = await Task.findById(req.params.id); 
        // iterate over updates array to make updates 
        updates.forEach((update) => {   // updates is array of strings, so update is a string
            task[update] = req.body[update];  // dynamic -- will pull property value from 'update'
        })
        await task.save();  // this is where middleware is executed;  

        // this logic only fires if !task AND the :id has the exact same number of digits expected;  - drops to catch logic otherwise
        if (!task) {
            console.log('task not found')
            return res.status(404).send();   // 404 is Record Not Found (id not found);  
        }
        res.send(task);   // sends back the updated task data (because runValidators option set to true) 
    } catch (e) {
        res.status(400).send(e);  // validation failed
    }
})

/* HTTP Delete for Tasks */
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);  
        // this logic only fires if !task AND the :id has the exact same number of digits expected;  - drops to catch logic otherwise
        if (!task) {
            return res.status(404).send();   // 404 is Record Not Found (id not found);  
        }
        res.send(task); 
    } catch (e) {
        res.status(500).send(e); 
    }
}); 

module.exports = router;  