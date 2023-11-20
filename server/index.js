import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import bookRouter from "./routes/bookRoutes.js";

const app = express();

// Parsing json data
app.use(express.json());

// Http route connection for root:
app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send(`Request completed!`);
});

// Routes imported from bookRoutes.js:
app.use("/books", bookRouter);

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
