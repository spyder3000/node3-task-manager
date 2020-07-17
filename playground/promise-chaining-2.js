require('../src/db/mongoose')
const Task = require('../src/models/task')   // load Task model
//const { Model } = require('mongoose')   // gives access to mongoose Model function (e.g. Model.findByIdAndDelete) 

// Mongoose queries documentation -- https://mongoosejs.com/docs/queries.html (most popular) OR https://mongoosejs.com/docs/api/model.html  (many more)

/* Promise Chaining using real async operations;  get id from Robo 3T & delete for that id via mongoose .findByIdAndDelete */
/*Task.findByIdAndDelete('5f0e5bbfcbf9634b3c9aa398', {}).then((task) => {
    console.log(task); // task not needed for this unless we want to see what just got deleted 
    return Task.countDocuments({ completed: false})   // .countDocuments is a mongoose function;  {} is criteria;   (returns # of not completed tasks)
}).then((result) => {
    console.log(result); 
}).catch((e) => {
    console.log(e)
})*/

/* Use Await & Async to Delete a Specific Task using mongoose */
const deleteTaskAndCount = async (id) => {
    /*const task = */ await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })  // ES6 shorthand for age: age;  
    return count
}

deleteTaskAndCount('5f0e4ab67575004dc417852c').then((count) => {
    console.log(count); 
}).catch((e) => {
    console.log(e); 
})
