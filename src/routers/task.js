const express = require('express'); 
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router();   /* create a Router */

/*  Send POST data via HTTP Request (from Postman) -- e.g. localhost:3000/tasks;  clicking Send on Postman w/ valid 'body' data 
        will trigger this to run;  returns json data on Postman;  data save to db as found on Robo 3T */ 
// Async version of the same logic below */
router.post('/tasks', auth, async (req,res) => {   // these were app.post calls when this was in index.js 
    //const task = new Task(req.body); 
    const task = new Task({
        ...req.body,   // spread operator to copy all properties from req.body of task to be created
        owner: req.user._id   // the user we just authenticated;  add owner property to returned data
    })
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

/*  Async -- Send GET data via HTTP request to get all tasks (e.g. from Postman)  */
// e.g. localhost:3000/tasks?completed=false;  
// e.g. localhost:3000/tasks?limit=2&skip=1    // e.g. skip is # of documents to skip 
// e.g. localhost:3000/tasks?sortBy=createdAt:desc  
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {      // ch 119 -- req.query.completed will be the parameter string 'true' or 'false'
        match.completed = req.query.completed === 'true'  // will be set to 0 or 1
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')  // split by special char in URL (e.g. for createdAt: desc)
        sort[parts[0]] = (parts[1] == 'desc') ? -1 : 1;   // result will be an object with name of Sort field & 1,-1 -- e.g {createdAt: -1}
    }
    try {
        // const tasks = await Task.find({});  // Task.find() returns promise;  returns all tasks of all owners

// ch 115 -- Task.find OR await req.user.populate('tasks') -- both will work to populate tasks 
//        const tasks = await Task.find({ owner: req.user._id});  // returns just the tasks for a specific owner
//        res.send(tasks); 
//  OR 
//      await req.user.populate('tasks').execPopulate() 
//      res.send(req.user.tasks); 
        // ch 119 - expand populate to include an object w/ key fields;  ch 120 -- limit & skip 
        await req.user.populate({
            path: 'tasks', 
            match,    // e.g. match: match,  
            options: {
                limit: parseInt(req.query.limit),    // note:  mongoose will ignore 'limit' if req.query.limit is not a number or not provided
                skip: parseInt(req.query.skip), 
                sort    // e.g. sort: sort;  e.g. {createdAt: 1} for Asc, -1 for Desc}
            } 
        }).execPopulate()   // alternative to prev 2 lines 
        res.send(req.user.tasks); 
    } catch (e) {
        res.status(400).send(); // 500 is internal server error
    }
})

/*  Send GET data via HTTP request to get ONE task (e.g. from Postman) using route parameters (:id) -- e.g. localhost:3000/tasks/98sxx...;  */
/*  Async/Await version of commented code below */
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;  
    //console.log(req.params); 
    try {
         // const task = await Task.findById(_id); 
         //  note: use .findOne to search by mult criteria;  check to make sure this is a task the user actually created (compare vs owner)
         const task = await Task.findOne({ _id, owner: req.user._id});   
         if (!task) {
            return res.status(404).send();   // 404 is Record Not Found (id not found); 
        }
        res.send(task);   // success will return w/ default of 200 of OK & user object          
    } catch (e) {
        res.status(500).send(); // 500 is internal server error
    }
})

/* Async -- patch to update an existing resource */
router.patch('/tasks/:id', auth, async (req, res) => {
    // Return error to user if update is to fields that are not allowed 
    const updates = Object.keys(req.body);   // return an array of strings that are properties (properties submitted to be updated) 
    const allowedUpdates = ['description', 'completed']    // array of properties the user is allowed to update 
    const isValidOperation = updates.every((update) => {    // runs for each property in updates array
        return allowedUpdates.includes(update);   // .includes() returns a boolean 
    })
    if (!isValidOperation) return res.status(400).send( {error: 'Invalid updates!!'}); 

    try {   // req.params.id is from :id, req.body is JSON that will have field/vals to update (e.g. description), 
        // const task = await Task.findById(req.params.id); 
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id }) 
        if (!task) {
            return res.status(404).send();   // 404 is Record Not Found (id not found);  
        }

        // iterate over updates array to make updates 
        updates.forEach((update) => {   // updates is array of strings, so update is a string
            task[update] = req.body[update];  // dynamic -- will pull property value from 'update'
        })
        await task.save();  // this is where middleware is executed;  
        res.send(task);   // sends back the updated task data (because runValidators option set to true) 
    } catch (e) {
        res.status(400).send(e);  // validation failed
    }
})

/* HTTP Delete for Tasks */
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);  
        // modified from Task.findByIdAndDelete so we can use 2 parameters)  
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send();   // 404 is Record Not Found (id not found);  
        }
        res.send(task); 
    } catch (e) {
        res.status(500).send(e); 
    }
}); 

module.exports = router;  