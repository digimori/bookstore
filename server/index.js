import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";

const app = express();

// Http route connection:
app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send(`Request completed!`);
});

// Database connection
mongoose
  .connect(mongoDBURL)
  .then(() => {
    // try block for success
    console.log(`Success, connection to database established.`);
    // Port listener
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    // error block
    console.log(`Cannot connect to database, Error: ${error}`);
  });
