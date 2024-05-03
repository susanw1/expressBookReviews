const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if (!req.body.user) {
        return res.status(400).json({message: "No user info in body"});
    }
    const username = req.body.user.name;
    const password = req.body.user.password;

    if (!username) {
        return res.status(400).json({message: "No username in body"});
    }
    if (!password) {
        return res.status(400).json({message: "No password in body"});
    }
    if (isValid(username)) {
        return res.status(400).json({message: `User '${username}' already exists`});
    }

    users.push( { username: username, password: password } )
    return res.status(200).json({message: `User created: ${username}`});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const bookInfo = Array.from(Object.entries(books), ([k, v]) => ({ isbn: k, title: v.title, author: v.author }));
    return res.status(200).send(JSON.stringify(bookInfo));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const matchingBooks = Object.entries(books)
        .filter(([k, v]) => k == isbn)
        
    if (matchingBooks.length == 0) {
        return res.status(404).json( { message: `No book with ISBN '${isbn}'` } );
    }
    // should just be a single match, so assume [0]; then take item [1] which is the 'v' value from Object.entries above 
    const book = matchingBooks[0][1]
    return res.status(200).send(JSON.stringify(book));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingBooks = Object.values(books)
        .filter(v => v.author == author)

    return res.status(200).send(JSON.stringify(matchingBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchingBooks = Object.values(books)
        .filter(v => v.title == title)

    return res.status(200).send(JSON.stringify(matchingBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const matchingReviews = Object.entries(books)
        .filter(([k, v]) => k == isbn)
        .map(([k, v]) => v.reviews)
        
    if (matchingReviews.length == 0) {
        return res.status(404).json( { message: `No book with ISBN '${isbn}'` } );
    }
    // should just be a single match, so assume [0]
    const reviews = matchingReviews[0]
    return res.status(200).send(JSON.stringify(reviews));
});

module.exports.general = public_users;
