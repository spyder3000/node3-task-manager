require('../src/db/mongoose')
const User = require('../src/models/user')
const { Model } = require('mongoose')   // gives access to mongoose Model function (e.g. Model.findByIdAndUpdate) 

// Mongoose queries documentation -- https://mongoosejs.com/docs/queries.html (most popular) OR https://mongoosejs.com/docs/api/model.html  (many more)

/* Promise Chaining using real async operations;  get id from Robo 3T & update age for that id via mongoose .findByIdAndUpdate */
/*User.findByIdAndUpdate('5f0fb4f09ea23818180bddb3', {  age: 1 }).then((user) => {
    console.log(user); 
    return User.countDocuments({ age: 1})   // .countDocuments is a mongoose function
}).then((result) => {
    console.log(result); 
}).catch((e) => {
    console.log(e)
})*/

/* Use Await & Async to update data using mongoose */
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({ age })  // ES6 shorthand for age: age;  
    return count
}

updateAgeAndCount('5f0fb4f09ea23818180bddb3', 2).then((count) => {
    console.log(count); 
}).catch((e) => {
    console.log(e); 
})
