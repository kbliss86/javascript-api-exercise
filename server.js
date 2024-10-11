const express = require('express');//import express module
const apiRoute = require('./routes/apiRoutes');//import apiRoutes module

const app = express();//create an express server object names app
const PORT = process.env.PORT || 3001;//set the port to 3001 - this is the port that the server will listen on

//middleware for parsing JSON and urlencoded form data
app.use(express.json());//parse incoming JSON data - this is a method in the express object that takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object

//set api routes
app.use('/api', apiRoute);//use the apiRoutes module for any routes that start with /api

//start server
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
}); //start the server and listen on the port specified in the PORT variable. When the server starts, the callback function will run and log a message to the console.
