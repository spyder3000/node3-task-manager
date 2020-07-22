const mongoose = require('mongoose'); 

/* define the fields for 'task' collection on mongoose */
// const Task = mongoose.model('Task', {    /* mongoose will convert 'Task' to 'tasks' on the actual collection found on Robo 3T */
const taskSchema = new mongoose.Schema({  // must create a schema to use timestamps;  
    description: {
        type: String, 
        trim: true, 
        required: true
    }, 
    completed: {
        type: Boolean, 
        required: false, 
        default: false  
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,  // the data stored on owner will be an Object ID 
        required: true, 
        ref: 'User' // reference to User model
    }
}, {
    timestamps: true
})
const Task = mongoose.model('Task', taskSchema) 

module.exports = Task; 