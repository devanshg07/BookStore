import express from "express";
import { PORT, MongoDB_URL } from "./config.js";
import mongoose from "mongoose";
import booksRoute from "./routes/booksRoute.js";

const app = express();
app.use(express.json());

app.get('/', (req, res) =>{
    return res.status(200).send("Welcome!")
});

app.use('/books', booksRoute);

const startServer = async () => {
    try {
        await mongoose.connect(MongoDB_URL);
        console.log("mongodb integrated");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

startServer();