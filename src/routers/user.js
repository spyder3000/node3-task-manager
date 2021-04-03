const express = require('express'); 
const multer = require('multer'); 
const sharp = require('sharp'); 
const User = require('../models/user')
const auth = require('../middleware/auth')  // add authentication middleware
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')   // destructuring to grab just these 2 functions from export
const router = new express.Router();   /* create a Router */

/*  Send POST data via HTTP Request (from Postman) -- e.g. localhost:3000/users;  clicking Send on Postman w/ valid 'body' data 
        will trigger this to run;  returns json data on Postman;  data save to db as found on Robo 3T */ 
/* Await / Async version of commented code below */        
router.post('/users', async (req,res) => {   // modified to async - this will now return a promise 
    const user = new User(req.body); 
    try {
        await user.save();      // must save user prior to generateAuthToken?? 
        sendWelcomeEmail(user.email, user.name); 
        const token = await user.generateAuthToken()  // get Token;  uses user instance (specific user) instead of User model
        res.status(201).send({user, token});    // return user object & token string
    } catch(e) {
        res.status(400).send(e); 
    }
});     

/* Find a user that matches the email/pwd provided */
router.post('/users/login', async (req, res) => {
    try {       /* function found in models\user.js */
 //       console.log(req.body.email, req.body.password )
        console.log('user/login'); 
        console.log(req.method); 
        //console.log(req.body.email);
//        console.log(req.body);  
        const user = await User.findByCredentials(req.body.email, req.body.password);   // both params will be provided by body of request
        const token = await user.generateAuthToken()  // get Token;  uses user instance (specific user) instead of User model
        // res.send({ user: user.getPublicProfile(), token});  // ch 112 -- fn to strip out password & tokens array
        res.send({user: user, token});   // shorthand syntax to send user: user, token: token;  data sent will be user object (w/ email, name, age, etc)
                                    //  and also a token string [can see via login in Postman]
        // new function on model/users to return just the public data we should expose about user (will not include pwd or tokens array)                             
        //res.send({user: user.getPublicProfile(), token});  // uses new method on models\user.js to strip out pwd & tokens array                            
    } catch (e) {
        console.log('Login Attempt Fail??')  // e.g. error from User.findByCredentials;  
        res.status(400).send(); 
    }
})


/* URL -- https://mongoosejs.com/docs/queries.html - e.g. for Model.find(), Model.updateMany(), Model.deleteOne(), etc */
/*  Async -- Send GET data via HTTP request to get all users (e.g. from Postman) -- e.g. localhost:3000/users/  */
/*    note:  added 'auth' as 2nd param to execute the auth middleware prior running the async function -- only called if next() is executed */
//  COMMENTED (ch 109) as this has no purpose in final version -- no need for user to get all other users // 
/*router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})   // User.find() returns promise 
        res.status(201).send(users); 
     //   res.status(201).send(users)
    } catch(e) {
        res.status(400).send(e); 
    }
})*/

/* must be authenticated to logout;  must have specific token, so if a user is logged on from mult devices, only logoff of the one for this token */
/*  key data is already avail in req var from auth.js (req.user & req.token) */
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token    // keep all tokens in req.user.tokens that do NOT match req.tokens forwarded from auth.js 
        })
        await req.user.save()
        res.send()
    } catch (e) { 
        res.status(500).send()
    }
})

/* create a way to Logout of ALL sessions */
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];     /* already authenticated, so don't need to match vs req.token vs req.user.tokens array;  just clear */
        await req.user.save()
        res.send()
    } catch (e) { 
        res.status(500).send()
    }
})

/*  ch 109 - Async -- Send GET data via HTTP request to get curr User Profile (e.g. from Postman) -- e.g. localhost:3000/users/  */
/*    note:  added 'auth' as 2nd param to execute the auth middleware prior running the async function -- only called if next() is executed */
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);  // because auth returns req.user, we can simply send that 
}); 

/* ch 113 - Async -- patch to update an existing resource;  note this logic replaces call to /users/:id logic backed up in info113_user.js */
//   auth middleware (parameter 2) will authenticate token & allow access to req.user  
router.patch('/users/me', auth, async (req, res) => {
    // Return error to User if update is to fields that are not allowed 
    const updates = Object.keys(req.body);   // return an array of strings that are properties 
    const allowedUpdate = ['name', 'email', 'password', 'age']    // array of properties the user is allowed to update 
    const isValidOperation = updates.every((update) => {    // runs for each property in updates array
        return allowedUpdate.includes(update);   // .includes returns a boolean 
    })
    if (!isValidOperation) return res.status(400).send( {error: 'Invalid updates!!'}); 

    try {   // removed const user = await User.findById logic, will use req.user instead
        // iterate over updates array to make updates 
        updates.forEach((update) => {   // updates is array of strings, so update is a string
            req.user[update] = req.body[update];  // dynamic -- will pull property value from 'update'
        })
        await req.user.save();  // this is where middleware is executed;  
        res.send(req.user);   // sends back the updated user data (because runValidators option set to true) 
    } catch (e) {
        res.status(400).send(e);  // validation failed
    }
})

/* ch 113 - HTTP Delete for Users */  
// logic for router.delete('/users/:id', auth, async (req, res) => {   moved to info113_user.js 
router.delete('/users/me', auth, async (req, res) => {  
    try {
        await req.user.remove();  
        sendCancelEmail(req.user.email, req.user.name); 
        res.send(req.user); 
    } catch (e) {
        res.status(500).send(e); 
    }
}); 

// ch 123, 125 - configure multer - specify what type of files (e.g. pdf only OR images only);  dest is the directory to store the images;
const upload = multer({     
    //dest: 'avatars',  // ch 127 - commenting this prevents uploads from saving to this dir;  is available w/in router.post callback fn instead (below)
    limits: {
        fileSize: 1000000   // max file size in bytes;  1000000 = 1MB
    }, 
    // this function gets called internally by multers;  has 3 args (request, info about file, callback)
    fileFilter(req, file, cb) {     // file param info at API section of www.npmjs.com/package/multer
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/) )  {    // reg expression as tested on regex101.com 
            return cb(new Error('File must be a .png, .jpg, or .jpeg file'));  
        }
        cb(null, true);  // 1st arg is null if nothing went wrong;  true means upload is expected
    }              
})

// ch 123 - download sample files for this from links.mead.io/files
// e.g. localhost:3000/users/me/avatar  -- endpoint for client to upload a profile pic 

// ch 126 -- basic middleware for custom errors
// 'avatar' matches key from Postman (or wherever);  will store in 'avatars' folder as specified in dest above  
/*router.post('/users/me/avatar', upload.single('avatar'), async (req,res) => {   
    res.send(); 
}, (error, req, res, next) => {  // ch 126 - added this fn at end for errors;  4 params in this seq lets express know this is a fn for unhandled errors 
    res.status(400).send({error: error.message});    // e.g. error.message from new Error fileFilter above
})*/  

/* upload.single() is the multer middleware;  
    1st param is route, 2nd param is auth middleware, 3rd is upload specification, 4th is success, 5hh is error handler;  
        'avatar' is just a string that will match the 'key' value in Body on Postman;   */
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {    
    // ch 127 - req.file.buffer contains a buffer of all the binary data for this file (accessible only if dest: is not specified above)
    // sharp is async, so use await;  final value needs to be a buffer, so .toBuffer();  .png() converts to png
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()   
    req.user.avatar = buffer   
    await req.user.save()  // save this change to capture avatar;  store to req.user the file information (avatar) from upload 
    res.send(); 
}, (error, req, res, next) => {  // ch 126 - added this fn at end for errors;  4 params in this seq lets express know this is a fn for unhandled errors 
    res.status(400).send({error: error.message});    // e.g. error.message from new Error fileFilter
})  

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {   // a new endpoint where the client can delete an avatar 
    req.user.avatar = undefined   // set to undefined to remove avatar from req.user
    await req.user.save()  // save this change to capture avatar
    res.send(); 
}, (error, req, res, next) => {  // added this function at end for errors;  4 params in this seq lets express know this is a function for unhandled errors 
    res.status(400).send({error: error.message});    // e.g. error.message from new Error fileFilter
}) 

// ch 128 -- Serving up Files 
router.get('/users/:id/avatar', async (req, res) => {  // async because await below
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()   // will immediately jump to catch (no user, no user avatar)
        }
        // normally we don't have to set this, as it defaults to application/json;  tells user what type of data they're getting 
        res.set('Content-Type', 'image/png');    // name of response header to set, value of response header
        res.send(user.avatar); 
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;  