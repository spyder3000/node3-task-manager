/* the starting point for our application -- creates an express app & gets it running;  references to 2 routers for various HTTP requests */
const express = require('express'); 
require('./db/mongoose')  // will connect to mongoose
const userRouter = require('./routers/user'); 
const taskRouter = require('./routers/task'); 

const app = express()
const port = process.env.PORT || 3000;    // process.env.PORT will come from Heroku for production

// middleware function we create -- app.use() to register a new middleware function to run
/* app.use((req, res, next) => {
    // console.log(req.method, req.path);   // e.g. GET /users
    if (req.method == 'GET') {
        res.send('GET requests are disabled')
    } else {
        next();   // needed to let express know that we're done w/ this middleware function;  allows subsequent route handler to run;  
    }
}) */ 

/* middleware for maintenance mode -- site down for maintenance */
/*app.use((req, res, next) => {
    res.status(503).send('Site is currently down.  Please try again later.'); 
})*/ 

/* functions provided by express */
app.use(express.json());    // setup express to automatically parse json 
app.use(userRouter);  // register our new router w/ our existing express app 
app.use(taskRouter);  

// ***  without middleware   new request -> run route handler
// ***  with middleware      new request -> do something  ->  run route handler 

app.listen(port, () => {
    console.log('Server is up on port ' + port); 
})

/* note that hashed data is one way -- cannot be gotten back;  encrypted data can be un-encrypted */
// const bcrypt = require('bcryptjs');   // example of this is found in info5_index.js 
const jwt = require('jsonwebtoken'); 

const myFunction = async () => {   // first param (ojb) needs a unique identifier (e.g. _id), 2nd param is secret (used to sign token) which is 
                                    //    used to make sure the token hasn't been tampered with in any way (a random series of chars);  
                                    //  3rd param is when token expires (e.g. 0 seconds, 7 days, etc) 
    const token = jwt.sign({ _id: 'aaa' }, 'jv433abc9998', { expiresIn: '7 days'})  // return value from .sign() is the authentication token;  
    console.log(token); // JSON webtoken is actually separated into 3 parts separated by periods;  1st part is a base-64 json encoded string (header), 
        //2nd part (payload or body) is base-64 which includes data provided (id) & timestamp, 3rd part is signature which is used to verify token;  
        // can copy the 2nd part of the token & go to www.base64decode.org to decode this;  

    const data = jwt.verify(token, 'jv433abc9998');  // 2 params;  2nd param is the exact same secret as used above 
    console.log(data); 
}

myFunction(); 