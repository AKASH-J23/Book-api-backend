// Import libraries
const express = require ("express");

// Import data
const database = require("./database/database")

// App specification
const myapp = express();

// configuration
myapp.use(express.json());

// root directory
myapp.get("/", (req,res)=>{
    return res.json({Welcome: "Hello this is a book api router"})
})

// to get all books
myapp.get("/books", (req,res)=>{
    return res.json({books:database.books})
})

// to get specific book based on number
myapp.get("/books/:isbn", (req,res)=>{
    const specbook = database.books.filter(
        (book)=>book.ISBN === req.params.isbn
    )
    if (specbook.length===0){
        return res.json({err: `No book found for ${req.params.isbn}`})
    }
    return res.json({books: specbook})
})

// to get books based on category
myapp.get("/books/cat/:category", (req,res)=>{
    const catbook = database.books.filter(
        (book)=>book.category.includes(req.params.category)
    )
    if (catbook.length===0){
        return res.json({err: `No book found for category ${req.params.isbn}`})
    }
    return res.json({books: catbook})
})

//to get books based on author
myapp.get("/books/auth/:author", (req,res)=>{
    const auth = database.books.filter(
        (book)=> book.authors.includes(parseInt(req.params.author))
    )
    if (auth.length===0){
        return res.json({err: `No book found for author ${req.params.author}`})
    }
    return res.json({book: auth})
})

// to get all authors 
myapp.get("/authors", (req,res)=>{
    return res.json({Author: database.authors})
})

// to get specific author
myapp.get("/authors/:author", (req,res)=>{
    const auth= database.authors.filter(
        (authors)=> authors.name == req.params.author
    )
    if (auth.length===0){
        return res.json({err: `No author found named ${req.params.author}`})
    }
    return res.json({Author: auth})
})

// to get authors based on book
myapp.get("/authors/book/:isbn", (req,res)=>{
    const authbook = database.authors.filter(
        (author) => author.books.includes(req.params.isbn)
    )
    if (authbook.length===0){
        return res.json({err: `No author found for the book ${req.params.isbn}`})
    }
    return res.json({Author: authbook})
})

// to get all publications
myapp.get("/publications", (req,res)=>{
    return res.json({publication: database.publications})
})

// to get specific publications
myapp.get("/publications/:name", (req,res)=>{
    const pubDetails= database.publications.filter(
        (pub)=> pub.name === req.params.name
    )
    if (pubDetails.length===0){
        return res.json({err: `No details found ${req.params.name}`})
    }
    return res.json({Publication: pubDetails}) 
})

// to get list of publications based on book
myapp.get("/publications/book/:isbn", (req,res)=>{
    const pubBook = database.publications.filter(
        (pub) => pub.books.includes(req.params.isbn)
    )
    if (pubBook.length===0){
        return res.json({err: `No Publications found for the book ${req.params.isbn}`})
    }
    return res.json({publications: pubBook})
})

// to add new book 
myapp.post("/books/add", (req, res)=>{
    const {newBook} = req.body
    database.books.push(newBook)
    return res.json({Newbook: "Added new book !"})
})

// to add new author
myapp.post("/authors/add", (req,res)=>{
    const {newAuth} = req.body
    database.authors.push(newAuth)
    return res.json({Author: "New author added !"})
})

// to add new publications
myapp.post("/publications/add", (req,res)=>{
    const {newPub} = req.body
    database.publications.push(newPub)
    return res.json({New_Pub: "New publication added !"})
})

// to update book details
myapp.put("/books/update/:isbn", (req,res)=> {
    database.books.forEach((book)=>{
        if (book.ISBN === req.params.isbn){
            book.title = req.body.bookTitle
            return
        }
    })
    return res.json({Updated_Books: database.books})
})

// to update new author for book
myapp.put("/books/update/author/:isbn", (req,res)=> {
    //update book db
    database.books.forEach((book)=>{
        if (book.ISBN === req.params.isbn){
            return book.authors.push(req.body.newAuthor)
        }
    })

    //update author db
    database.authors.forEach((author)=>{
        if (author.id === req.body.newAuthor){
            return author.books.push(req.params.isbn)
        }
    })
    return res.json({
        books: database.books,
        authors: database.authors,
        message: "updated author and books in db !"
    })
})

// port connection
myapp.listen(3000,()=>console.log("Server Running!"));