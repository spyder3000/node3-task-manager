/* Logic moved from index.js to separate the application call for express into its own module;  Exported so this will allow our 
    user.test.js to call this w/out calling listen.  And index.js can call this AND call listen;  */  

/* the starting point for our application -- creates an express app & gets it running;  references to 2 routers for various HTTP requests */
const express = require('express'); 
const path = require('path');   // core node module (nodejs.org);  do not need to install via npm i xxx on cmd prompt
const hbs = require('hbs'); 

require('./db/mongoose')  // will connect to mongoose
const userRouter = require('./routers/user'); 
const taskRouter = require('./routers/task'); 

const app = express()

// DEfine paths for Express config;  __dirname is path to current directory;  path.join to go up one level & into public dir;  
const publicDirectoryPath = path.join(__dirname, '../public');  // this line will match to public files first (e.g. index.html) prior to app.get stmts below  
const partialsPath = path.join(__dirname, '../templates/partials'); 
//const viewsPath = path.join(__dirname, '../templates/views');  // express defaults to 'views' folder;  this modifies that to 'templates/views' instead 

// Setup handlebars engine & views location 
app.set('view engine', 'hbs');     // e.g. set up a view engine (handlebar) for Express 
//app.set('views', viewsPath);   // express default is 'views' folder for .hbs content;  this overrides that  
hbs.registerPartials(partialsPath);  

app.use(express.static(publicDirectoryPath))   // Setup static directory;  app.use to customize our server;  


/* functions provided by express */
// express.json() -- setup express to automatically parse incoming json (e.g. from POST) to an object so we can access in 
//      our request handlers -- e.g. req.body within  app.post('/users', (req, res) => { ... req.body
app.use(express.json());    
app.use(userRouter);  // register our new router w/ our existing express app 
app.use(taskRouter);  

// ***  without middleware   new request -> run route handler
// ***  with middleware      new request -> do something  ->  run route handler 

// app.get lets us configure what the server should do when user enters a url -- e.g. call will return HTML or JSON
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather', 
        name: 'Oreo'
    });    // allows us to render one of our views (one of the handlebar templates) 
})

module.exports = app
