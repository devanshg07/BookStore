import express, { request, response } from "express";
import {PORT, MongoDB_URL} from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();
app.use(express.json());

app.get('/', (req, res) =>{
    return res.status(200).send("Welcome!")
});

app.post('/books', async (req,res) =>{
    try {

        if(
            !req.body.title || !req.body.author || !req.body.publishYear
        ){
            return res.status(400).send({
                message: "missing fields"
            })
            }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
            };
        
        const book = await Book.create(newBook);
        return res.status(201).send(book);
        }
        
     catch (error) {
        console.log(error);
        res.status(500);
    }
})

app.get('/books', async (req,res) =>{
    try {
        const books = await Book.find({});
        return res.status(200).json({
            count: books.length,
            data: books,
        });

    } catch (error) {
        console.log(error)
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const books = await Book.findById(id)

        return res.status(200).json({
            count: books.length,
            data: books
        })
    } catch (error) {
        console.log(error)
    }
});

app.put('/books/:id', async (req, res) => {
    try {

        if(
            !req.body.title || !req.body.author || !req.body.publishYear
        ){
            return res.status(400).send({
                message: "missing fields"
            })
            }
   const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body);

    if(!result){
        return res.status(400).send("Book not found");
    }
    return res.status(200).send("Book details changed!")
        
    } catch (error) {
        console.log(error);
    }
});
app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).send("Book not found");
        }

        return res.status(200).send("Book deleted!");

    } catch (error) {
        console.log(error);

        return res.status(500).send("Server error");
    }
});
try {
    mongoose.connect(MongoDB_URL);
    console.log("mongodb integrated")
    console.log(PORT)
} catch (error) {
    console.log(error)    
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});