const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Book = require("./model/book");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://DharaniselviMoorthi:dharani31@cluster0.v2jzapg.mongodb.net/digitalLibrary?appName=Cluster0")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

/* CREATE */
app.post("/books", async (req, res) => {
    const book = new Book(req.body);
    const saved = await book.save();
    res.status(201).json(saved);
});

/* READ */
app.get("/books", async (req, res) => {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
});

/* UPDATE */
app.put("/books/:id", async (req, res) => {
    const updated = await Book.findByIdAndUpdate(
        req.params.id,
        { read: req.body.read },
        { new: true }
    );
    res.json(updated);
});

/* DELETE */
app.delete("/books/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});