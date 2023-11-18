# bookstore
React Book Store Application utilizing MERN stack.

### MongoDB - A NoSQL Database that utilizes document based databasing
### ExpressJS - A Web framework
### ReactJS - A JavaScript library 
### NodeJS - JavaScript serverside run-time environment allowing the rest of the stack to be used outside of the browser

## Workspace Setup:
In your chosen code editor (For this, I am using Gitpod for ease of use as it comes with many packages such as NodeJS installed,  
If you don't, you're going to need to install it on your system and install it into your editor such as VSCode

## Base File tree:
- Folder - backend (server)
- Folder - client (front-end/client)
- File - .gitignore
- File - Readme.md

## Project Initialization: 
### Backend:
- cd backend/ - This is to change directory into the backend, where we will install the following:
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
  


