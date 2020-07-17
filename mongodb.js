/* NOT USed in final application;  used for testing thru ch 82? */
// CRUD operations 

//const mongodb = require('mongodb'); 
//const MongoClient = mongodb.MongoClient;   // will give us access to the function necessary to connect to the database
//const ObjectID = mongodb.ObjectID;   // Mongo id (the generated id for each record) 
const {MongoClient, ObjectID } = require('mongodb');  // destructured version of prev 3 lines 

// define connection URL - use full IP 127.0.0.1 instead of 'localhost' (the same) because 'localhost' has caused some slowdowns?  
const connectionURL  = 'mongodb://127.0.0.1:27017';   // connect to localhost in first Terminal tab;  
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {    // 2nd param should always be true
    if (error) {
        return console.log('Unable to connect to database'); 
    }
    console.log('Connected correctly');

    // mongodb will automatically create a db if doesn't already exist, so don't need to create this elsewhere
    const db = client.db(databaseName);    

    /* Delete multiple recs based on criteria;  uses Promises --  .then & .catch are Promise functions  */
    /*db.collection('users').deleteMany({  
        age: 28
    }).then((result) => {
        console.log(result.deletedCount); 
    }).catch((error) => {
        console.log(error); 
    });*/ 

    /* Delete One rec based on criteria */
    /*db.collection('tasks').deleteOne({
        _id: new ObjectID("5f0ba0e58e787e1ff4c36c82")
    }).then((result) => {
        console.log(result.deletedCount); 
    }).catch((error) => {
        console.log(error); 
    }); */

    /* https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/ */
/*    db.collection('users').updateOne({
        _id: new ObjectID("5f0b9d4ea7c4372244a74168"), 
    }, {
        $set: {  // update operators for updates we want to perform
            name: 'Georgette', 
        },
        $inc: {  // increments field by specified amount w/out having to fetch the record first
            age: 1, 
        }
    }).then((result) => {
        console.log(result.modifiedCount); 
    }).catch((error) => {
        console.log(error); 
    })  */

    /* db.collection('tasks').updateMany({     // update all tasks that are not completed to completed 
        completed: false, 
    }, {
        $set: {  // update operators for updates we want to perform
            completed: true 
        }
    }).then((result) => {
        console.log(result.modifiedCount); 
    }).catch((error) => {
        console.log(error); 
    })  */

    /* Fetch a single record from db;  if multiple, will select just the first one  */
    //db.collection('users').findOne({ name: 'Andrew' }, (error, user) => {
    //db.collection('users').findOne({ name: 'Jen', age: 1 }, (error, user) => {    // returns null 
    /*db.collection('users').findOne({ _id: new ObjectID("5f0b9d4ea7c4372244a74168")}, (error, user) => {   // _id is an object so needs new ObjectID call
        if (error) {
            return console.log('Unable to fetch'); 
        }
        console.log(user); 
    })*/

    // .find returns mult items;  returns a cursor instead of an array;  no callback;  cursor has methods such as count(), limit(), & toArray()
    /*db.collection('users').find({ name: 'Andrew' }).toArray((error, users) => {
        console.log(users); 
    });  
    db.collection('users').find({ name: 'Andrew' }).count((error, cnt) => {  //cursor allows us to retrieve a count w/out storing all recs 
        console.log(cnt); 
    });*/

    /*db.collection('tasks').findOne({ _id: new ObjectID("5f0ba0e58e787e1ff4c36c84") }, (error, task) => {  
        if (error) {
            return console.log('Unable to fetch Task'); 
        }
        console.log(task); 
    });
    
    db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
        console.log(tasks); 
    });*/  

    
});   

