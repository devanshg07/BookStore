import express from "express";
import {Book} from "../models/bookModel.js"
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).json({
                message: "missing fields"
            });
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        };

        const book = await Book.create(newBook);
        return res.status(201).json(book);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.get('/', async (req, res) => {
    try {
        const books = await Book.find({});
        return res.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).json({
                message: "missing fields"
            });
        }

        const { id } = req.params;
        const result = await Book.findByIdAndUpdate(id, req.body, { new: true });

        if (!result) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: "Book deleted!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;