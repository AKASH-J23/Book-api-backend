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

// to update author name using id
myapp.put("/authors/update/:authId", (req,res)=>{
    database.authors.forEach((author)=>{
        if (author.id === parseInt(req.params.authId)){
            author.name = req.body.authName
            return
        }
    })
    return res.json({Updated_Author: database.authors})
})

// to update publication name using id
myapp.put("publications/update/:id", (req,res)=>{
    database.publications.forEach((pub)=>{
        if (pub.id === parseInt(req.params.id)){
            pub.name = req.body.pubName
            return
        }
    })
    return res.json({updated_pub: database.publications})
})

//to update or add new book to publications
myapp.put("/publications/update/book/:isbn", (req,res)=>{
    //update pub db
    database.publications.forEach((publication)=>{
        if(publication.id === req.body.pubId){
            return publication.books.push(req.params.isbn)
        }
    })

    //update book db
    database.books.forEach((book)=>{
        if (book.ISBN === req.params.isbn){
            book.publication= req.body.pubId
            return
        }
    })
})

// delete a book
myapp.delete("/books/delete/:isbn", (req,res)=>{
    const updatedBookdb = database.books.filter((book)=>{
        return book.ISBN !== req.params.isbn
    })
    database.books = updatedBookdb
    return res.json({books: database.books})
})

// delete author from a book
myapp.delete("/books/delete/author/:isbn/:authorId", (req,res)=>{
    //update book db
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            const newAuthList = book.authors.filter(
                (author)=> author !== parseInt(req.params.authorId)
                )
                book.authors= newAuthList
                return
        }
    })

    //update author db
    database.authors.forEach((author)=>{
        if (author.id === parseInt(req.params.authorId)){
            const newBookList = author.books.filter(
                (book)=> book !== req.params.isbn
            )
            author.books = newBookList
            return
        }
    })
    return res.json({bookdb: database.books, authdb: database.authors, deleted: "Author was deleted"})
}) 

// delete an author 
myapp.delete("/authors/delete/:id", (req,res)=>{
    const updatedAuthDb = database.authors.filter((author)=>{
        return author.id !== parseInt(req.params.id)
    })
    database.authors= updatedAuthDb
    return res.json({updated_authors: database.authors})
})

// delete a publication
myapp.delete("publications/delete/:id", (req,res)=>{
    const updatedPub = database.publications.filter((pub)=>{
        return pub.id !== parseInt(req.params.id)
    })
    database.publications = updatedPub
    return res.json({deleted_pub: database.publications})
})

// delete a book from publications
myapp.delete("/publications/delete/book/:id/:books", (req,res)=>{
    database.publications.forEach((pub)=>{
        if(pub.id === parseInt(req.params.id)){
            const newBookList = pub.books.filter(
                (book)=> book !== req.params.books 
            )
            pub.books = newBookList
            return
        }
    })
    database.books.forEach((book)=>{
        if (book.ISBN === req.params.books){
            book.publication=0;
            return
        }
    })
    return res.json({message: "deleted publications"})
})

// port connection
myapp.listen(3000,()=>console.log("Server Running!"));