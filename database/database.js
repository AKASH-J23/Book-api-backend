const books = [
    {
        ISBN: "set1",
        title: "Harry potter",
        authors: [1, 2],
        language: "en",
        pubDate: "2020-07-01",
        category: ["thriller", "adventure", "magic"],
        publication: 1
    },
    {
        ISBN: "set2",
        title: "jumanji",
        authors: [2],
        language: "en",
        pubDate: "2018-07-07",
        category: ["thriller", "adventure"],
        publication: 2
    }
]

const authors = [
    {
        id:1,
        name: "johnny",
        books: ["set1"]
    },
    {
        id:2,
        name: "harry",
        books: ["set1","set2"]
    }
]

const publications = [
    {
        id:1,
        name: "juvan",
        books: ["set1"]
    },
    {
        id:2,
        name: "centeroid",
        books: ["set2"]
    }
]

module.exports = {books,authors,publications}