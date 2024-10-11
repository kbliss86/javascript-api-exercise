const express = require('express');//import express framework to crate routes
const fs = require('fs');//import the 'fs' module to interact the the "file system" for reading and writing data to files, fs is a core Node.js module
//Explanation of fs module:
//- `fs.readFileSync(path, encoding)`: Reads the content of a file at the specified path synchronously and returns it as a string.
//- `fs.writeFileSync(path, data)`: Writes data to a file at the specified path synchronously. In this case, we use it to update `db.json` with the modified data.
const path = require('path');//import path module to work with file and directory paths, path is a core Node.js module
//Explanation of path module:
//- `path.join()`: Joins multiple path segments together, ensuring the correct directory separator is used, which helps avoid issues when running on different operating systems.
const router = express.Router();//create a new instance of router which allows is to create mountable route handlers - router is a middleware function that can be used for routing and it is part of the express framework

//define a path to the db.json file - this could be a database connection in a real application
//example of database connection: const db = require('./db');//import the database connection from the db.js configuration file
//.join() method joins the path segments together and normalizes the resulting path - this is used to create a path to the db.json file and is a part of the path module, __dirname is a global object that represents the directory name of the current module
const dbPath = path.join(__dirname, '../data/db.json');//set the path to the db.json file

//helper function to read the db.json file - could be a database query in a real application
//This function reads the db.json file synchronously and returns the parsed JSON content
const readDb = () => {
    const db = fs.readFileSync(dbPath, 'utf8');//read the db.json file as a string using the 'utf8' encoding - fs.readFileSync() is a synchronous method that reads the entire contents of a file - it is part of the fs module
    return JSON.parse(db);//parse the JSON data and return it as a javascript object
};

//helper function to write to the db.json file - could be a database query in a real application
//This function writes the data to the db.json file synchronously and formats the JSON content
const writeDb = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));//write the data to the db.json file, fs.writeFileSync() is a synchronous method that writes data to a file - it is part of the fs module
}

//Explanation of req and res:
//- `req` (request): Represents the HTTP request made by the client. It contains information such as the request body, query parameters, headers, etc.
//- `res` (response): Represents the HTTP response that the server sends back to the client. It has methods like `res.json()` to send JSON data, `res.status()` to set the HTTP status code, etc.

//API ROUTES
//get all users
// Method: GET /api/users - gets all users - no parameter
router.get('/users', (req, res) => {//when /users is used in the URL it will trigger this function
    const db = readDb();//read the current state of the db.json file/database  - using the helper middleware
    res.json(db);//send the data as a JSON response - res.json() is a method in the express object that sends a JSON response to the client, by including db as an argument, the data for the entire JSON object is sent as a JSON response
});

//get user by id
// Method: GET /api/users/:id (e.g., /api/users/1) - the ":" indicates a URL parameter - in this case the id of the user
router.get('/users/:id', (req, res) => {//when /users/:id is used in the URL it will trigger this function
    const db = readDb();//read the current state of the db.json file/database  - using the helper middleware
    const user = db.find(user => user.id === parseInt(req.params.id));//find the user with the specified id from the request parameter
    if (user) {
        res.json(user);//if the user is found, send the user data as a JSON response
    } else{
        res.status(404).send('User not found');//sif the user is not found, send a 404 error
    }
});

//Create a new user
// Method: POST /api/users
router.post('/users', (req, res) => {//when /users is used in the URL it will trigger this function
    const db = readDb();//read the db.json file - using the helper middleware
    //create a new user, the id is set to be the length of the users array + 1, this is a simple way to generate unique ids, in a real application, a more robust method would be used
    //name and email are derived from the JSON request body
    const newUser = {
        id: db.users.length + 1,//use the available length of the users array to generate a unique id
        name: req.body.name,//get the name from the request body
        email: req.body.email//get the email from the request body
    };
    db.users.push(newUser);//add the new user to the db.json file - push() is a method that adds an element to the end of an array
    writeDb(db);//write the updated data to the db.json file - middleware helper function
    res.json(db);//send the updated data as a JSON response - res.json() is a method in the express object that sends a JSON response to the client in this case its the entire json object
});

//update a user by id
// Method: PUT /api/users/:id (e.g., /api/users/1)
router.put('/users/:id', (req, res) => {//when /users/:id is used in the URL it will trigger this function
    const db = readDb();//read the db.json file - using the helper middleware
    //find the user with the specified user index
    const userIndex = db.users.findIndex(user => user.id === parseInt(req.params.id));//find the index of the user with the specified id
    //update the user data if the user is found
    if (userIndex.length !== -1) {//if the user is found
        // Update the database with the filtered list of users
        db.users[userIndex] = { id: parseInt(req.params.id), ...req.body}
        writeDb(db);//write the updated data to the db.json file - middleware helper function
        res.json(db.users[userIndex]);//send the updated user data as a JSON response - this will only send the updated user data
    }
    else {
        res.status(404).send('User not found');//send a 404 error if the user is not found if a user is not found
    }
});

//delete a user by id
// Method: DELETE /api/users/:id (e.g., /api/users/1)
router.delete('/users/:id', (req, res) => {//when /users/:id is used in the URL it will trigger this function})
    const db = readDb(); //read the db.json file - using the helper middleware
    //filter out the user with the specified id
    const updatedUsers = db.users.filter(user => user.id !== parseInt(req.params.id));

    if (updatedUsers.length !== db.users.length) {//if the user is found (index is not out of bounds)
        db.users = updatedUsers;//specifies the user that is to be deleted from the db.json file
        writeDb(db);//write the updated data to the db.json file
        res.json({ message: 'User Deleted'});//send a success message as a JSON response
    } else {
        res.status(404).send('User not found');//send a 404 error if the user is not found
    }
});

module.exports = router;//export the router object