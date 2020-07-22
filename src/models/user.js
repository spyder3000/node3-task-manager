const mongoose = require('mongoose'); 
const validator = require('validator');  
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const Task = require('./task'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true 
    }, 
    email: {
        type: String, 
        unique: true,   /* won't let the same email be created for 2 different users */
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
    }, 
    tokens: [{      /* stores an array of token objects */
        token: {
            type: String, 
            required: true
        }
    }], 
    avatar: {
        type: Buffer
    } 
}, {
    timestamps: true
})

/* setup a Virtual Attribute - not stored on User document;  just allows mongoose to relate Tasks to a User */
userSchema.virtual('tasks', {
    ref: 'Task', 
    localField: '_id',     // field on this collection that will relate to the foreignField (_id & owner will be matched)
    foreignField: 'owner'    // name of the field on the Task that's going to create this relationship
})

/* option 1 -- getPublicProfile is a specific method we created that can be called to strip out pwd & tokens array */
//userSchema.methods.getPublicProfile = function () {  // note:  using this var, so don't use arrow functions 

/* option 2 -- .toJSON will overwrite internal function which executes when express processes objects;  so without being called, this 
                    method will strip out pwd & tokens array for user for all express calls */
userSchema.methods.toJSON = function () {  // not explicitly called
    const user = this       
    // note that doing deletes on user directly does not work??? -- needs to be converted to simple object first 
    const userObject = user.toObject()   // gets a raw object with our user data attached;  will remove mongoose stuff currently attached to user 
    delete userObject.password;   //remove password from user
    delete userObject.tokens;       // remove tokens array from user
    delete userObject.avatar;       // remove avatar from user profile response;  avatar can be got via _id
    return userObject; 
}

/*   statics methods are accessible on the model;  methods methods are accessible on the instance */
userSchema.methods.generateAuthToken = async function () {
    const user = this;    // access the specific user for this instance
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)   // toString() because user._id is an object id;  same secret as auth.js 
    user.tokens = user.tokens.concat({ token: token })   // saving token to user 
    await user.save();  
    return token; 
}

/* add function to userSchema schema;  setting this up as something we can access directly on the Model once we have access to it */
/*   statics methods are accessible on the model;  methods methods are accessible on the instance */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })  // find user by Email first 
    if (!user) {
        throw new Error('Unable to Login'); 
    }
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
        throw new Error('Unable to Login'); 
    }
    return user; 
}

/* moddleware runs some code before user is saved;  Hash the plain Text password;   
        note:  cannot use arrow function as 'this' function does not work inside the arrow function */
userSchema.pre('save', async function (next) {  // runs some code before user is saved 
    const user = this; 
    console.log('Middleware running -- Just before saving'); 
    // do not modify password if it isn't changed 
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8); 
    }

    next();  // next() needs to be called or this will spin in place forever
})

// middleware that Deletes User Tasks when User is removed 
userSchema.pre('remove', async function (next) {
    const user = this; 
    await Task.deleteMany({ owner: user._id })    // mongoose function to be used on Task model
    next(); 
})

const User = mongoose.model('User', userSchema) 

module.exports = User; 