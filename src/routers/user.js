const express = require('express'); 
const User = require('../models/user')
const auth = require('../middleware/auth')  // add authentication middleware
const router = new express.Router();   /* create a Router */

/*router.get('/test', (req, res) => {
    res.send('This is from my other router from new file'); 
})*/
//app.use(router);  // register our new router w/ our existing express app 

/*  Send POST data via HTTP Request (from Postman) -- e.g. localhost:3000/users;  clicking Send on Postman w/ valid 'body' data 
        will trigger this to run;  returns json data on Postman;  data save to db as found on Robo 3T */ 
/* Await / Async version of commented code below */        
router.post('/users', async (req,res) => {   // modified to async - this will now return a promise 
    const user = new User(req.body); 
    try {
        await user.save();      // must save user prior to generateAuthToken?? 
        const token = await user.generateAuthToken()  // get Token;  uses user instance (specific user) instead of User model
        res.status(201).send({user, token});    // return user object & token string
    } catch(e) {
        res.status(400).send(e); 
    }
});     

/*  Send POST data via HTTP Request (from Postman) -- e.g. localhost:3000/users;  clicking Send on Postman w/ valid 'body' data 
        will trigger this to run;  returns json data on Postman;  data save to db as found on Robo 3T */
/* app.post('/users', (req,res) => {
    user.save().then(() => {
        res.status(201);   // 201 is Created;  200 is OK 
        res.send(user)
    }).catch((e) => {     //  e.g. if pwd is too short;  default would still return status code of 200; see https://httpstatuses.com/  
        res.status(400);  // bad request;  
        res.send(e)
    });  
})  */

/* Find a user that matches the email/pwd provided */
router.post('/users/login', async (req, res) => {
    try {       /* function found in models\user.js */
        console.log(req.body.email, req.body.password )
        const user = await User.findByCredentials(req.body.email, req.body.password);   // both params will be provided by body of request
        const token = await user.generateAuthToken()  // get Token;  uses user instance (specific user) instead of User model
        res.send({user, token});   // shorthand syntax to send user: user, token: token;  data sent will be user object (w/ email, name, age, etc)
                                    //  and also a token string [can see via login in Postman]
    } catch (e) {
        res.status(400).send(); 
    }
})


/* URL -- https://mongoosejs.com/docs/queries.html - e.g. for Model.find(), Model.updateMany(), Model.deleteOne(), etc */
/*  Async -- Send GET data via HTTP request to get all users (e.g. from Postman) -- e.g. localhost:3000/users/  */
/*    note:  added 'auth' as 2nd param to execute the auth middleware prior running the async function -- only called if next() is executed */
//  COMMENTED as this has no purpose in final version -- no need for user to get all other users // 
/*router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})   // User.find() returns promise 
        res.status(201).send(users); 
     //   res.status(201).send(users)
    } catch(e) {
        res.status(400).send(e); 
    }
})*/

/*  Async -- Send GET data via HTTP request to get curr User Profile (e.g. from Postman) -- e.g. localhost:3000/users/  */
/*    note:  added 'auth' as 2nd param to execute the auth middleware prior running the async function -- only called if next() is executed */
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);  // because auth returns req.user, we can simply send that 
}); 

/*  Async -- Send GET data via HTTP request to get ONE users (e.g. from Postman) using route parameters (:id) -- e.g. localhost:3000/users/98sxx...;  */
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;  
    //console.log(req.params); 
    try {
        const user = await User.findById(_id); 
        if (!user) {
            return res.status(404).send();   // 404 is Record Not Found (id not found);  
        }
        res.send(user); 
    } catch(e) {
        res.status(500).send(e); 
    }
})

/* Async -- patch to update an existing resource */
router.patch('/users/:id', async (req, res) => {
    // Return error to User if update is to fields that are not allowed 
    const updates = Object.keys(req.body);   // return an array of strings that are properties 
    const allowedUpdate = ['name', 'email', 'password', 'age']    // array of properties the user is allowed to update 
    const isValidOperation = updates.every((update) => {    // runs for each property in updates array
        return allowedUpdate.includes(update);   // .includes returns a boolean 
    })
    if (!isValidOperation) return res.status(400).send( {error: 'Invalid updates!!'}); 

    try {   // req.body is JSON that will have field/vals to update (e.g. name), 'new' returns a new user so we'll have latest data, 
            //   runValidators to ensure the updated data is in format we're expecting     
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });  

        /* Logic here replaces User.findByIdAndUpdate in line above;  this logic executed so we can utilize middleware in \src\models\user.js */
        const user = await User.findById(req.params.id); 
        // iterate over updates array to make updates 
        updates.forEach((update) => {   // updates is array of strings, so update is a string
            user[update] = req.body[update];  // dynamic -- will pull property value from 'update'
        })
        await user.save();  // this is where middleware is executed;  

        // this logic only fires if !user AND the :id has the exact same number of digits expected;  - drops to catch logic otherwise
        if (!user) {
            return res.status(404).send();   // 404 is Record Not Found (id not found);  
        }
        res.send(user);   // sends back the updated user data (because runValidators option set to true) 
    } catch (e) {
        res.status(400).send(e);  // validation failed
        //res.status(500).send(e); 
    }
})

/* HTTP Delete for Users */
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);  
        // this logic only fires if !user AND the :id has the exact same number of digits expected;  - drops to catch logic otherwise
        if (!user) {
            return res.status(404).send();   // 404 is Record Not Found (id not found);  
        }
        res.send(user); 
    } catch (e) {
        res.status(500).send(e); 
    }
}); 



module.exports = router;  