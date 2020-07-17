const mongoose = require('mongoose'); 
const validator = require('validator');  

const connectionURL  = 'mongodb://127.0.0.1:27017';   // connect to localhost in first Terminal tab;  
//const databaseName = 'task-manager';

/* note that mongoose uses mongodb behind the scenes, so some similarity in code */
mongoose.connect(connectionURL + '/task-manager-api', {   // creates new database -- task-manager-api
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false   //  to fix (node:18156) DeprecationWarning: collection.findAndModify is deprecated. (saw in promise-chaining.js) 
})
