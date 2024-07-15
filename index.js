// Basic Express JS Server Setup
// [SECTION] Dependecies and Modules
// use the "require" directive to load the express module/package that will allows us to easily create a server
const express = require("express");
// use the "require" directive to load the mongoose module/package that allows us to create Schemas to model our data structure and manipulate our database
const mongoose = require("mongoose");
const cors = require("cors");

// use the "require" directive to load the cors module/package that allows us our backend application to connect/be available for our frontend application
// it allows us to control Cross Origin Resource Sharing of our application

// [SECTION] Server Setup
// creates an "app" variable that stores the express function/server
const app = express();

// [SECTION] Environment Setup
// assigning a port number for the server to listen to
const port = 4000;

// [SECTION] Middlewares
// allows us to handle incoming data from requests
// allows our app to read json data and convert it to a JS Object
app.use(express.json());
// allows us to receive data/information in other data types aside from strings or arrays.
app.use(express.urlencoded({ extended: true }));
// allows all resources to access our backend application
app.use(cors());

// [SECTION] Database connection
// connects our applicaion to our database
mongoose.connect(
  "mongodb+srv://admin:admin1234@piyongx2024.ku3ul0q.mongodb.net/Blogpost-Application?retryWrites=true&w=majority&appName=piyongx2024"
);

// the "db" variable will store the connection status of our mongodb atlas
let db = mongoose.connection;

// failed connection
db.on("error", console.error.bind(console, "connection error"));
// successful connection
db.once("open", () => console.log(`We're now connected to MongoDb Atlas`));

// BackEnd Routes
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

// [SECTION] Server Gateway Response
if (require.main === module) {
  app.listen(process.env.PORT || port, () =>
    console.log(`API is now online on port ${process.env.PORT || port}`)
  );
}

module.exports = { app, mongoose };
