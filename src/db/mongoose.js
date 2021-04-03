const mongoose = require('mongoose'); 
const validator = require('validator');  

// note:  connect to localhost in first Terminal tab;  ch 133 - replace w/ env var
const connectionURL  = process.env.MONGODB_URL;  //  e.g. 'mongodb://127.0.0.1:27017/task-manager-api'

/* note that mongoose uses mongodb behind the scenes, so some similarity in code */
//mongoose.connect(connectionURL + '/task-manager-api', {   // creates new database -- task-manager-api
mongoose.connect(connectionURL, {   // creates new database -- task-manager-api    
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false   //  to fix (node:18156) DeprecationWarning: collection.findAndModify is deprecated. (saw in ch 93 promise-chaining.js) 
})
