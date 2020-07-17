// CRUD operations 

//const mongodb = require('mongodb'); 
//const MongoClient = mongodb.MongoClient;   // will give us access to the function necessary to connect to the database
//const ObjectID = mongodb.ObjectID;   // Mongo id (the generated id for each record) 
const {MongoClient, ObjectID } = require('mongodb');  // destructured version of prev 3 lines 

// define connection URL - use full IP 127.0.0.1 instead of 'localhost' (the same) because 'localhost' has caused some slowdowns?  
const connectionURL  = 'mongodb://127.0.0.1:27017';   // connect to localhost in first Terminal tab;  
const databaseName = 'task-manager';

//const id = new ObjectID();  // function will generate a new ID for us;  
//console.log(id);   // displays GUID returned;  embedded is a timestamp;  https://docs.mongodb.com/manual/reference/method/ObjectId/index.html 
//console.log(id.getTimestamp()); 

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {    // 2nd param should always be true
    if (error) {
        return console.log('Unable to connect to database'); 
    }
    console.log('Connected correctly');

    // mongodb will automatically create a db if doesn't already exist, so don't need to create this elsewhere
    const db = client.db(databaseName); 
   
    /* Insert One collection into db */
    /*db.collection('users').insertOne({  // .insertOne expects object w/ all data to insert as arg1 
        //_id: id,        // use id field created here instead of having mongoDB do it;  not really useful, but we can do this;   
        name: 'Victor', 
        age: 19
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert user'); 
        }
        console.log(result.ops);  // ops is an array of documents (e.g. [{name: 'Andrew', age: 27, _id: 5f0b... }])
    })*/  
    
    /* Bulk insert of multiple collections */
    /*db.collection('users').insertMany([ 
        { name: 'Jen', age: 28 }, 
        { name: 'Alvin', age: 43 }
    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert documents'); 
        }
        console.log(result.ops);  // ops is an array of documents (e.g. [{name: 'Andrew', age: 27, _id: 5f0b... }])       
    })*/

    /* Insert 3 items w/ properties description & completed (boolean) to new db 'tasks' */
    /*db.collection('tasks').insertMany([ 
        { description: 'Clean the house', completed: true }, 
        { description: 'Get car inspected', completed: false }, 
        { description: 'Buy birthday gift', completed: true }
    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert documents'); 
        }
        console.log(result.ops);  // ops is an array of documents        
    })*/



});   

