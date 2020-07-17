const mongoose = require('mongoose'); 
const validator = require('validator');  
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

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
    }] 
})

/*   statics methods are accessible on the model;  methods methods are accessible on the instance */
userSchema.methods.generateAuthToken = async function () {
    const user = this;    // access the specific user for this instance
    const token = jwt.sign({_id: user._id.toString()}, 'secret333token')   // toString() because user._id is an object id 
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

const User = mongoose.model('User', userSchema)

module.exports = User; 