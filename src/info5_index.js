/* the starting point for our application -- creates an express app & gets it running;  references to 2 routers for various HTTP requests */
const express = require('express'); 
require('./db/mongoose')  // will connect to mongoose
const userRouter = require('./routers/user'); 
const taskRouter = require('./routers/task'); 

const app = express()
const port = process.env.PORT || 3000;    // process.env.PORT will come from Heroku for production

/* setup express to automatically parse json */
app.use(express.json()); 
app.use(userRouter);  // register our new router w/ our existing express app 
app.use(taskRouter);  

app.listen(port, () => {
    console.log('Server is up on port ' + port); 
})

/* note that hashed data is one way -- cannot be gotten back;  encrypted data can be un-encrypted */
const bcrypt = require('bcryptjs'); 
const myFunction = async () => {
    const password = 'hello123'; 
    const hashedPassword = await bcrypt.hash(password, 8)   // 2nd param is # of rounds -- higher # is more secure (8 is recommended) 
    console.log(password, hashedPassword)
    const isMatch = await bcrypt.compare('hello123', hashedPassword);  // checks pwd by comparing hash of entered pwd to already stored hash
    console.log(isMatch); 
}

myFunction(); 