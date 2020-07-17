const mongoose = require('mongoose'); 

/* define the fields for 'task' collection on mongoose */
const Task = mongoose.model('Task', {    /* mongoose will convert 'Task' to 'tasks' on the actual collection found on Robo 3T */
    description: {
        type: String, 
        trim: true, 
        required: true
    }, 
    completed: {
        type: Boolean, 
        required: false, 
        default: false  
    } 
})

module.exports = Task; 