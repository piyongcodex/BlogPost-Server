// [SECTION] Dependencies and Modules
// use the "require" directive to load the express modules/package to allow us access to the Router() method
const express = require("express");
// the userController will allows us access to the controller functions
const userController = require("../controllers/user");
const { verify } = require("../auth");
// [SECTION] Routing Component
// we use "router" variable to store the Router() method and allow us access to different HTTP methods
const router = express.Router();

// [SECTION] Routes

// Route for user registration
router.post("/register", userController.registerUser);

// Route for user authentication
router.post("/login", userController.loginUser);

// Route for user details
router.get("/details", verify, userController.getDetails);

// [SECTION] Export Route System
// allows us to export the "router" object and use it in other files within the project
module.exports = router;
