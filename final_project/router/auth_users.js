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
    if (!authenticatedUser(currUser.name, currUser.password)) {
        return res.status(401).json({message: "Authentication failed"});
    }
    const accessToken = jwt.sign({data: currUser}, 'access', {expiresIn: 3600 });
    req.session.authorization = { accessToken };
    return res.status(200).send(`User '${currUser.name}' logged in`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review;

    const matchingBook = Object.entries(books)
        .filter(([k, v]) => k == isbn)
        .map(([k, v]) => v)
        .find(b => true);
    
    if (!matchingBook) {
        return res.status(404).json( { message: `No book with ISBN '${isbn}'` } );
    }

    const thisUsername = req.user.data.name;
    matchingBook.reviews[thisUsername] = reviewText;

    return res.status(200).json( { message: `Review added/updated for book: ${isbn}, user: ${thisUsername}` } );
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review;

    const matchingBook = Object.entries(books)
        .filter(([k, v]) => k == isbn)
        .map(([k, v]) => v)
        .find(b => true);
    
    if (!matchingBook) {
        return res.status(404).json( { message: `No book with ISBN '${isbn}'` } );
    }

    const thisUsername = req.user.data.name;
    if (matchingBook.reviews[thisUsername]) {
        delete matchingBook.reviews[thisUsername]        
        return res.status(200).json( { message: `Review deleted for book: ${isbn}, user: ${thisUsername}` } );
    } else {
        return res.status(404).json( { message: `No review found for book: ${isbn}, user: ${thisUsername}` } );
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users; 
