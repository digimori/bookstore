import express from "express";
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
app.post("/books", async (response, request) => {
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
