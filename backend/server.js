import express from "express";
import {PORT, MongoDB_URL} from "./config.js";
import mongoose from "mongoose";

const app = express();

app.get('/', (req, res) =>{
    return res.status(200).send("Welcome!")
});

app.listen(PORT, ()=>{
    console.log(PORT);
})

try {
    mongoose.connect(MongoDB_URL);
    console.log("mongodb integrated")
} catch (error) {
    console.log(error)    
}