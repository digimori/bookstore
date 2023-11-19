# bookstore

React Book Store Application utilizing MERN stack.

### MongoDB - A NoSQL Database that utilizes document based databasing

### ExpressJS - A Web framework

### ReactJS - A JavaScript library

### NodeJS - JavaScript serverside run-time environment allowing the rest of the stack to be used outside of the browser

## Workspace Setup:

In your chosen code editor (For this, I am using Gitpod for ease of use as it comes with many packages such as NodeJS installed),  
If you don't, you're going to need to install it on your system and install it into your editor such as VSCode

## Base File tree:

- Folder - server (server)
- Folder - client (front-end/client)
- File - .gitignore
- File - Readme.md

## Project Initialization:

### Backend:

- cd server/ - This is to change directory into the backend, where we will install the following:
- npm init -y - To initialize a JSON package to manage dependencies
- In the created JSON file, add the following into the first object (containing name, version etc): "type": "module" - This allows the use of ECMA scripts (import module/export module)
- Install expressJS and Nodemon packages using the following commands:
- npm install express nodemon
- Nodemon is used to restart the server automatically when changes are performed so that we don't have to keep closing and restarting the server
- Add the following scripts to the JSON package:

```
 "scripts" : {
  "start" : "node index.js", // This will run the project using a node.js environment
  "dev" : "nodemon index.js" //
```

### Express setup in the backend:

- Create an index.js file within the backend folder
- Within the index.js, import the expressJS framework:
  ```
  import express from "express";
  ```
- Then define a new variable for the connection:
  ```
  const app = express();
  ```
- The next step is to then create a config.js file, in order to listen for ports, then inside of the config.js, write the following:

```
export const PORT = 5555;
```

- An import for this Port will need to be defined in the index.js file

```
import { PORT } from './config.js';
```

- A function will be needed here to listen for this port, still within the index.js file:

```
app.listen(PORT, () =>{
  console.log(`App is listening on port: ${PORT}`)
})
```

- Check your node.js environment with the following terminal command  
  ( This will give you the version that you are currently running. If you did not specify a version in your installation of the package, it will default to the latest stable build):

```
node -v
```

- To test if this is working, we need to run the server with the following command:

```
npm run dev
```

**At this point, it will run and display Cannot GET / in the browser, which, upon inspection will show a 404.**  
**This is normal at this stage as we have not created our HTTP routes yet**

## Creating the HTTP routes:

- In server/index.js, AFTER the express variable (const app):

```
app.get('/', (request, response) => {
  console.log(request)
  return response.status(234).send(`Request completed!`)
});
/* This is a GET method used to get information from the server,
 The '/' signifies that it is in the root directory
 The second parameter is a callback function that is used to handle the request */
```

- This should now return "Request completed", on browser refresh.

## Adding MongoDB and Mongoose:

- Create a MongoDB account [here]() if you do not already have one.
- Create a new Cluster, setting the provider to your preference (AWS, GoogleCloud or Azure)
- Set your Region to the one closest to you
- Choose a name for your Cluster
- Click Create

- In Security > Quickstart:
- Create a username and password for the database user
- In Database overview - Click "Connect"
- Click Drivers
- Select the latest version of Node.js and follow the instructions provided to install MongoDB

```
npm install mongodb
```

- Copy your connection string - This will be used to connect your application to the database:

```
mongodb+srv://<USERNAME>:<PASSWORD>@<DATABASE-NAME>.th0cq6g.mongodb.net/?retryWrites=true&w=majority
```

- In the server/config.js file, a variable is needed for this string:

```
export const mongoDBURL = mongodb+srv://<USERNAME>:<PASSWORD>@<DATABASE-NAME>.th0cq6g.mongodb.net/<COLLECTION-NAME>?retryWrites=true&w=majority
```

- This will need to then be imported into index.js and can be done so in conjunction with the port.

- Following this, install Mongoose:

```
npm install mongoose
```

- And then import it into server/index.js:

```
import mongoose from 'mongoose';
```

## Connecting the Database:

- In index.js

```
mongoose.connect(mongoDBURL) // This variable is what our connection string is attached to in config.js
.then(() => {
  // Try block
  console.log('Log a message for successful connection');
  // We can also move the port listener that we created earlier into this block:
  app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
})
.catch((error) => {
// Catching errors
console.log('Error message')
})
```

## Creating the Book model with Mongoose:

[mongooseJS.com](https://mongoosejs.com)

- Mongoose is a Schema-based solution for modelling application data.

- Create a new Folder within the Server folder called 'models' to store the models in.
- Within that folder, create a file for the book model: bookModel.js

- The model itself (make sure to import mongoose at the top of the file):
- The object will carry the fields that we want to use ie book title, author, description, ISBN etc.

```
const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
     author: {
      type: String,
      required: true,
    },
     publicationDate: {
      type: Number,
      required: true,
    },
     description: {
      type: String,
      required: true,
    },
     ISBN: {
      type: Number,
      required: false, // Not necessarily available or important to some people
    },
     pageCount: {
      type: Number,
      required: false, // Like the ISBN
    },
  },
  {
    timestamps: true, // This is a creation date
  }
);


export const Book = mongoose.model('Book', bookSchema);
```

## Saving a new Book with Mongoose:

- Import the model from the bookModel.js file

```
import { Book } from './models/bookModel.js;
```

- A new HTTP route will be needed to manage the creation and saving of the new book entries (POST method):

```
app.post("/books", async (response, request) => {
  try {
    // Handles successful POST request
    // Checking if all of the required fields are in the body of the response (! would mean that them not being found is true):
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

    // However, if the request is returned successfully, we now want to create a newBook object to handle the creation:
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publicationDate: request.body.publicationDate,
      description: request.body.description,
    };

    const book = await Book.create(newBook);
    return response.status(201).send(book); // Book sent to client

    console.log(request);
  } catch (error) {
    // Handles the error and returns the error message
    console.log(`Could not create entry, Error message: ${error.message}`);
    response.status(500).send({ message: error.message });
  }
});

```

## Testing the POST request using Postman:

- **Note: Make sure your port is exposed, otherwise it will throw an auth error**

- You will need Middleware to parse the request body in index.js:

```
app.use(express.json());
```

- Create an Account at Postman
- On the dashboard, create a new POST request:

- Paste in the URL of your workspace (localHost if using as: http://localhost:5555/books)
- I'm using Gitpod, so it will be 5555-YourWorkspaceName/books
- Before sending, select the "Body" tag and tick 'raw' and under the 'text' dropdown, select JSON.
- Input test data into the body (Ideally matching the function you're using to test the request receipt):

```
{
  "title": "TestTitle",
  "author": "Testauthor",
  "publicationDate": "1234",
  "description": "testDesc
}
```

- Then Send.

## Getting All of the books using Mongoose (Will be needed to GET/POST):

```
// Http route to get all of the book entries from the database:
app.get("/books", async (request, response) => {
  try {
    const findBooks = await Book.find({});
    return response.status(200).json({
      count: findBooks.length, // This will return the number of entries in the database
      data: findBooks // Return array object with the collections
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
```

- Again, Test this in Postman via GET request, paste the host url in with /books on the end, hit Send, should return 200:

## Getting single entries by ID from Mongoose:

- Remember to run this through Postman to test requests.
- Get request will be the same as the previous one for "all" but with the id added to the end.

```
app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params; // Destructuring the ID from the entry's parameters into an id variable.
    const singleBook = await Book.findById(id); // Passing the destructured value into the findById method.
    return response.status(200).json(singleBook);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
```

## Updating entries:

- Updating is done via PUT method using Mongoose's findByIdAndUpdate() method.

```
app.put("/books/:id", async (request, response) => {
  // We first have to retrieve the entry that we want to edit.
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
    // Then we collect the id and pass both that and the parameter fields through the findByIdAndUpdate method.
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
```

- Once again, test with Postman via Put method with the entry id.
- You can also send test data via the Body using raw JSON, like when we initially tested the Post.

## Deleting Entries:

- Deleting Entries follows a similar process as update, but is much simpler.
- Get the book id and delete it using findByIdAndDelete.

```
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
```

## Refactoring NodeJS with Express Router:

## CORS policies:

## Create React App using Vite and installing TailwindCSS

## SPA and React-Router-Dom

## Showing Books list in React

## CRUD process in React:

## Showing Lists in components: (Map?)

## Modals:

## UX improvements:
