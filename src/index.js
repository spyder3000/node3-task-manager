/* the starting point for our application -- creates an express app & gets it running;  references to 2 routers for various HTTP requests */
const express = require('express'); 
require('./db/mongoose')  // will connect to mongoose
const userRouter = require('./routers/user'); 
const taskRouter = require('./routers/task'); 

const app = express()
//const port = process.env.PORT || 3000;    // process.env.PORT will come from Heroku for production
const port = process.env.PORT               // process.env.PORT will come from Heroku for production

/* functions provided by express */
app.use(express.json());    // setup express to automatically parse json 
app.use(userRouter);  // register our new router w/ our existing express app 
app.use(taskRouter);  

// ***  without middleware   new request -> run route handler
// ***  with middleware      new request -> do something  ->  run route handler 

app.listen(port, () => {
    console.log('Server is up on port ' + port); 
})
