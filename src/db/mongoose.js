const mongoose = require('mongoose'); 
const validator = require('validator');  

const connectionURL  = process.env.MONGODB_URL;   // connect to localhost in first Terminal tab;  

/* note that mongoose uses mongodb behind the scenes, so some similarity in code */
mongoose.connect(connectionURL + '/task-manager-api', {   // creates new database -- task-manager-api
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false   //  to fix (node:18156) DeprecationWarning: collection.findAndModify is deprecated. (saw in promise-chaining.js) 
})
