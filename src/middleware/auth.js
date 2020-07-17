const jwt = require('jsonwebtoken')  // to validate token provided
const User = require('../models/user')   // to find user in db after we've authenticated token

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','');  // e.g. key/value pair from Postman as defined in Header; e.g. Bearer eyJhbGc...
        const decoded = jwt.verify(token, 'secret333token');  // same secret token as in models/user.js

        // also want to make sure this token is in users token array (tokens are deleted from array upon logging out)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});  // tokens.token -- looks for user w/ a given token value in array
        if (!user) {
            throw new Error()  // no message - will trigger catch below
        }
        req.user = user;  // passes user, so route handlers won't have to access user a 2nd time; 
        next(); 
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate'})
    }
//    console.log('auth middleware'); 
//    next(); 
}

module.exports = auth; 

// middleware function we create -- app.use() to register a new middleware function to run
/* app.use((req, res, next) => {
    // console.log(req.method, req.path);   // e.g. GET /users
    if (req.method == 'GET') {
        res.send('GET requests are disabled')
    } else {
        next();   // needed to let express know that we're done w/ this middleware function;  allows subsequent route handler to run;  
    }
}) */ 

