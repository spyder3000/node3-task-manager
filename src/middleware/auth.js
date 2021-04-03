const jwt = require('jsonwebtoken')  // to validate token provided
const User = require('../models/user')   // to find user in db after we've authenticated token

// ch 109 -- Check JWT Authentication Tokens before proceeding to route handler 
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','');  // e.g. key/value pair from Postman as defined in Header; e.g. Bearer eyJhbGc...
        // token includes _id field which can be accessed w/in decoded;  same secret token as in models/user.js
        const decoded = jwt.verify(token, process.env.JWT_SECRET);   

        // also want to make sure this token is in users token array (active tokens;  tokens are deleted from array upon logging out)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});  // tokens.token -- looks for user w/ a given token value in array
        if (!user) {
            throw new Error()  // no message - will trigger catch below
        }
        req.token = token;   // setting req.token here allows other route handlers to have access to the token (e.g. to logoff) 
        req.user = user;  // passes user to allow route handler to access, so route handlers won't have to access user a 2nd time; 
        next();   // all is good;  let route handler run
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

