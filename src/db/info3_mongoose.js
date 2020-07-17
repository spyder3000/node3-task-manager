const mongoose = require('mongoose'); 
const validator = require('validator');  

const connectionURL  = 'mongodb://127.0.0.1:27017';   // connect to localhost in first Terminal tab;  
const databaseName = 'task-manager';

/* note that mongoose uses mongodb behind the scenes, so some similarity in code */
mongoose.connect(connectionURL + '/task-manager-api', {   // creates new database -- task-manager-api
    useNewUrlParser: true, 
    useCreateIndex: true 
})

const User = mongoose.model('User', {
    name: {
        type: String, 
        required: true, 
        trim: true 
    }, 
    email: {
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true, 
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Email is invalid'); 
            }
        }
    }, 
    password: {
        type: String, 
        required: true, 
        trim: true, 
        minlength: 7, 
        validate(val) {
            //throw new Error ('err = ' + val); 
            console.log(val.toLowerCase()); 
            var patt = new RegExp("password"); 
            if (patt.test(val.toLowerCase())) {  // OR if (val.toLowerCase().includes('password')) { 
                throw new Error ('Password cannot contain the text "password"'); 
            }
        }
    }, 
    age: {
        type: Number, 
        default: 0, 
        validate(val) {   /* customized validator */
            if (val < 0) {
                throw new Error ('Age must be >= 0'); 
            }
        }
    } 
})

/*const u = new User({
    name: '  Theodore ', 
    age: 37, 
    email: 'THEodore@theodore.com ', 
    password: '   3434k454  '
});

u.save().then(() => {
    console.log('success')
}).catch((error) =>  {
    console.log('Error!', error); 
});*/

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


const task = new Task({
    description: '  Read Book  ', 
    completed: true
});

// Save the new Task 
task.save().then(() => {
    console.log('success')
}).catch((error) =>  {
    console.log('Error!', error); 
});
