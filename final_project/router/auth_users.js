const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // write code to check if the username is valid
    return users.filter(u => u.username == username).length > 0
}

const authenticatedUser = (username, password)=>{ //returns boolean
    // check if username and password match the one we have in records.
    return users.filter(u => u.username == username && u.password == password).length > 0
}

// only registered users can login
regd_users.post("/login", (req,res) => {
    const currUser = req.body.user;
    if (!currUser) {
        return res.status(404).json({message: "No data in body"});
    }
    const accessToken = jwt.sign({data: currUser}, 'access', {expiresIn: 3600 });
    req.session.authorization = { accessToken };
    return res.status(200).send(`User '${currUser.name}' logged in`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
