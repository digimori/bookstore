# Book Storage App (Re-doing my Flask/Python project using MERN)

React Book Store Application utilizing MERN stack.

- MongoDB - A NoSQL Database that utilizes document based databasing
- ExpressJS - A Web framework
- ReactJS - A JavaScript library
- NodeJS - JavaScript serverside run-time environment allowing the rest of the stack to be used outside of the browser

## Workspace Setup:

In your chosen code editor (For this, I am using Gitpod for ease of use as it comes with many packages such as NodeJS installed),  
If you don't, you're going to need to install it on your system and install it into your editor such as VSCode

### Base File tree:

- Folder - server (server)
- Folder - client (front-end/client)
- File - .gitignore
- File - Readme.md

## Project Initialization:

### Backend/Node/Express:

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
  "dev" : "nodemon index.js"
 }
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

### Adding MongoDB and Mongoose:

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

### Connecting the Database:

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

### Creating the Book model with Mongoose:

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

### Saving a new Book with Mongoose:

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

### Testing the POST request using Postman:

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

### Getting All of the books using Mongoose (Will be needed to GET/POST):

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

### Getting single entries by ID from Mongoose:

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

### Updating entries:

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

### Deleting Entries:

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

### Refactoring NodeJS with Express Router:

- Put all of the HTTP routes into a separate file-folder, otherwise this is going to get messy.
- In server, create folder named "routes"
- In the folder, make a file for 'bookRoute.js'. This is useful as we can make separate ones if we have multiple models to handle.
- Paste the copied HTTP routes into bookRoute.js
- Import and create the express Router:

```
import express from 'express';
import {Book} from './models/bookModel.js';

const router = express.Router();
```

- Following this, all of the "app" in the requests (ie "app.get") need to be changed to "router" to match the variable we created.
- Example:

```
router.post('/books', async(request, response) => {})
```

- REMEMBER TO EXPORT!

```
export default router;
```

- Import these routes back into your main app index.js:

```
import booksRoute from './routes/bookRoutes.js';
```

- Following this, we can now remove the reference to 'books' in our routes, as the middleware that comes next will handle this (The /:id will stay, however).
  ie:

```
router.get('/', async(request, response) => {})
```

- The middleware that will handle this in place of the routes in index.js is:

```
app.use('/books', booksRoute); // This is basically saying to preface the routes with /books, which is why it isn't needed in the other file.
```

- Remember to once again test these with Postman to ensure the requests are received and sending correctly.

### CORS policies (Cross-Origin-Resource-Sharing):

- CORS policies are security policies used for sending/receiving information between different domains, ie forms.
- In the server, we need to install cors:

```
npm install cors
```

- This then needs to be imported and used as a middleware in index.js:

```
import cors from 'cors';

// Middleware, but we have options:
// 1. Allow All Origins with Default of cors(*)
app.use(cors());
// 2. Allow custom Origins, this allows for more control:
app.use(
  cors({
    origin: 'LocalHost/IDEHost', // Such as 'http://localhost:3000', Only clients from this origin can access the server-side.
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Methods we're currently using
    allowedHeaders: ['Content-Type'],

  }));

```

## Client-Side (React):

### Project Initialization using Vite and TailwindCSS:

- Remember to go back up into the root folder!

```
cd /
```

- Installation:

```
npm create vite@latest
```

- Select 'y'.
- Project name: 'frontend' or 'client' to keep it cohesive.
- Select 'React'
- then 'JavaScript'
- Once app is created:

```
cd client
npm install
// npm run dev is to start the server after.
```

- Next, Install TailwindCSS:
- Go to [TailwindCSS.com](https://tailwindcss.com/);
- Installation > Framework Guides > Vite > Using React
- Follow the steps provided

```
npm install -D tailwindcss postcss autoprefixer
// Wait for this to install, then:
npx tailwindcss init -p
// This creates a Config file for Tailwind
```

- The next step is for your dependencies, so these will go into your tailwind.config file:

```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- Then, in your index.css file that was also installed with Tailwind, replace the dummy code with:

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- App.css can be removed at this point as it will not be being used for this project.

- Now, run the build process:

```
npm run dev
```

- Following this, we can also replace the default App content in App.jsx with an RAFCE snippet, make sure ES7+ snippets are installed in your IDE.

## Single-Page-Application (SPA) and React-Router-Dom:

- Change directory into the client folder
- Install React-Router-Dom

```
npm install react-router-dom
```

- In 'Main.jsx', import the router:

```
import {BrowserRouter} from 'react-router-dom';
```

- We then need to change the App container from 'React.StrictMode' to BrowserRouter:

```
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

- We then import and create the routes in App.jsx:
- Each Route will need a path reference and an element (which will be the component it will refer to).

```
import {Routes, Route } from 'react-router-dom';
<Routes>
<Route path='/' element={<Home />} />
<Route path='/books/create' element={<CreateBooks />} />
<Route path='/books/details/:id' element={<ShowBooks />} />
</Routes>
```

- To handle the pages, we'll need a new folder in client > src > [folder here named 'pages']
- Within that, we need page components to handle the CRUD functionality:
- CreateBooks.jsx
- DeleteBook.jsx
- EditBook.jsx
- Home.jsx
- ShowBook.jsx

- These, populate them with the RAFCE snippet to give a base to work with.
- These paths will go into the Routes above (They will need to be imported at the top of App.jsx).

## Showing Books list in React:

- Additional NPM packages:
- Axios is used for sending HTTP requests and is a common method used in APIs (for example, RapidAPI)
- React-Icons just gives us an icons base to use, you can use FontAwesome or something like 8Icons instead if you prefer.

```
npm install axios react-icons
```

- Following this, we need to test the backend routes:
  So, for this, we actually need to change our original CORS policy back over to the basic one (We will change back later):

```
app.use(cors())
```

- Change directory back to the server and run.
- Open a second terminal, so that we can compare client and server side by side, CD into the client side on this one.
- Run both of the servers

### Component structure:

- client > src > components (new folder creation)
- New component: Loader.jsx (We will be using this component when waiting for information so that the user can see that something is happening.)
- All we need in here is the following for now, utilizing Tailwind's inline CSS:

```
const Loader = () => {
  return <div className="animate-ping w-16 h-16 m-8 rounded-full bg-sky-600"></div>;
};

export default Loader;
```

- Within the Home.jsx component, we need to import the following:

```
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader.jsx"; // For Async/Await requests
import { Link } from "react-router-dom"; // In order to use links within the page
// Some icons to make the page more user friendly
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
```

- We will be using useState and useEffect to manage the component lifecycles.
- Axios is the reference back to the HTTP requests.

### State Management in the Home.jsx component:

```
const [books, setBooks] = useState([]); // Initial State is set to an empty array
  const [loading, setLoading] = useState(false);  // Initial state for loading the content
```

- A useEffect with an empty dependency parameter will be used to manage the Update lifecycle:

```
useEffect(() => {
    setLoading(true); // Start loading the content
    axios
      .get(
        "http://5555-digimori-bookstore-6c00cvdc0rz.ws-eu106.gitpod.io/books"
      ) // Bear in mind, Gitpod changes this often, in case it stops working.
      .then((response) => {
        setBooks(response.data.data);
        setLoading(false); // Stop loading once the data has been received.
      })
      .catch((error) =>{
        console.log(error);
        setLoading(false); // If the data cannot be retreived, stop attempting and pass an error to the user.
      });
  }, []);

```

## Constructing the JSX and Using Ternaries to display one or another:

- Basic JSX construction with a Link component taking us to the CreateBooks component page:

```
return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Books List:</h1>
        <Link to="/books/create">
          <MdOutlineAddBox className="text-sky-800 text-4xl" />
        </Link>
      </div>
    </div>
  );

```

- Under this, we will be getting the list of entries that have already been created via a Ternary operation:
- Remember, if Left side is true, the first block (?) runs, else (:) the second will return a table.

```
{loading ? (
  <Loader />
) : (
 <Table element here /> (Though I'd be tempted to turn it into another component)
)
}
```

- For the body of the table, you can loop over the book entries using the map method:
- Book and Index will be passed through as arguments (as each index will need a key to identify it also).
- This will use templating pattern like {book.title}, {book.author} etc.

```
{books.map((book, index) =>(
              <tr key={book._id} className="h-8">
                <td className="border border-slate-700 rounded-md text-center">
                  {index + 1} // + 1 is due to index being zero-based, and no entry is going to start at 0, it will be 1.
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {book.title}
                </td>
              </tr>
            ))}
```

## CRUD process in React:

## Showing Lists in components: (Map?)

## Modals:

## UX improvements:

## Further improvements to make:

- Additional model fields, such as the ability to upload images of the books, rating system? Ability to sort by rating?
- Auth to allow users to have their own storage
- Search Field
- A tick box to tell whether or not the book has been read or not
