import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

// Parsing json data
app.use(express.json());

// Http route connection for root:
app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send(`Request completed!`);
});

// Http route connection to save a new book entry with the POST method:
app.post("/books", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publicationDate ||
      !request.body.description
    ) {
      return response.status(400).send({
        message:
          "Please send all required fields: title, author, publicationDate, description.",
      });
    }

    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publicationDate: request.body.publicationDate,
      description: request.body.description,
    };

    const book = await Book.create(newBook);
    return response.status(201).send(book);

    console.log(request);
  } catch (error) {
    console.log(`Could not create entry, Error message: ${error.message}`);
    response.status(500).send({ message: error.message });
  }
});

// Http route to get all of the book entries from the database:
app.get("/books", async (request, response) => {
  try {
    const findBooks = await Book.find({});
    return response.status(200).json({
      count: findBooks.length,
      data: findBooks,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Http route to retrieve single entries via ID:
app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const singleBook = await Book.findById(id);
    return response.status(200).json(singleBook);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Http route to Update a book (PUT method):
app.put("/books/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publicationDate ||
      !request.body.description
    ) {
      return response.status(400).send({
        message:
          "Please send all required fields: title, author, publicationDate, description.",
      });
    }
    const { id } = request.params;
    const bookUpdate = await Book.findByIdAndUpdate(id, request.body); // Pulling the id and passing the results of the request.body
    if (!bookUpdate) {
      return response.status(404).json({ message: "Book Entry not found." });
    }
    return response
      .status(200)
      .send({ message: "Book entry updated successfully." });
  } catch (error) {
    console.log(`Could not update entry, Error message: ${error.message}`);
    response.status(500).send({ message: error.message });
  }
});

// Http Route to Delete the book entry
app.delete("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const bookDelete = await Book.findByIdAndDelete(id); // Pulling the id and passing the results of the request.body

    if (!bookDelete) {
      return response
        .status(404)
        .json({ message: "Book Entry has not been deleted" });
    }
    return response
      .status(200)
      .send({ message: "Book entry successfully deleted." });
  } catch (error) {
    console.log(`Could not delete entry, Error message: ${error.message}`);
    response.status(500).send({ message: error.message });
  }
});

// Database connection
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log(`Success, connection to database established.`);
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Cannot connect to database, Error: ${error}`);
  });
