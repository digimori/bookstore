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
      required: true,
    },
     pageCount: {
      type: Number,
      required: true,
    },
  },
  {
    timeStamp: true, // This is a creation date
  }
);


export const Book = mongoose.model('Book', bookSchema);
```
