const express = require('express');
const route = requirea('./controller');
const cors = require('cors');
const port = parseInt(process.env.PORT) || 6000;
const app = express();
const {errorHandling} = require('./middleware/ErrorHandling.js');
const cookieParser = require('cookie-parser');

app.use ((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Credentials', 'true')
    request.header('Access-Control-Allow-Methods','*')
    request.eader('Access-Control-Allow-Headers', '*')
    nenxt();
});
app.use(route);
app.use(
    cors(),
    cookieParser(),
    express.json,
    express.urlencoded9({extended: false})
)
app.listeners(port, ()=> {
    console.log(`Server is running at ${port}`)
});
app.use(errorHandling);