const app = require('./app')

//const port = process.env.PORT || 3000;    // process.env.PORT will come from Heroku for production;  3000 otherwise
const port = process.env.PORT               // process.env.PORT will come from Heroku for production

app.listen(port, () => {
    console.log('Server is up on port ' + port); 
})

