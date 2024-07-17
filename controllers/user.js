// [SECTION] Dependencies and Modules
const User = require("../models/User");
// use the "require" directive to load the bcryptjs module/package that allows us to encrypt information
const bcrypt = require("bcryptjs");
const auth = require("../auth");

module.exports.getName = (req, res) => {
  const { id } = req.params;
  console.log(id);
  return User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  });
};

module.exports.getDetails = (req, res) => {
  console.log(req.user.id);
  return User.findById(req.user.id).then((user) => {
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  });
};
module.exports.registerUser = (req, res) => {
  // create a variable called "newUser" and instantiate a new "User" object using the "User" model
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    // hashSync() method is used to encrypot information.
    // 10 is the number of "salt" rounds
    password: bcrypt.hashSync(req.body.password, 10),
  });

  //username type
  if (typeof req.body.username !== "string") {
    return res
      .status(400)
      .send({ error: "Username invalid, must be alphanumeric" });
  }
  //username length
  if (req.body.username.length < 4) {
    return res
      .status(400)
      .send({ error: "Username must be atleast 4 characters" });
  }
  //email must have @
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  }
  //password length
  if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ error: "Password must be atleast 8 characters" });
  }

  return newUser
    .save()
    .then((user) =>
      res.status(201).send({ message: "Registered SUccessfully" })
    )
    .catch((saveErr) => {
      console.error("Error in saving the user: ", saveErr);

      return res.status(500).send({ error: "Error in Save" });
    });
};
module.exports.loginUser = (req, res) => {
  // if the user email given in the request body contains "@"
  if (typeof req.body.username === "string") {
    // findOne() method return the first document in the collection that matches our search criteria
    return User.findOne({ username: req.body.username })
      .then((user) => {
        // If the user does not exist
        if (user == null) {
          return res.status(401).send({ error: "No User found" });

          // If the user exists
        } else {
          // compareSync() method to compare the login password and the database password. it decrypts the database password and then compare it to the request body password. it will return true if it matches and will return false otherwise
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          // If the password matches
          if (isPasswordCorrect) {
            return res
              .status(200)
              .send({ access: auth.createAccessToken(user) });

            // If the password does not match
          } else {
            // 401 status code means unauthorized. This means that the user is not authorized to acces the application. The credentials does not match
            return res
              .status(401)
              .send({ error: "Username and password do not match" });
          }
        }
      })
      .catch((findErr) => {
        console.error("Error in finding the user: ", findErr);

        return res.status(500).send({ error: "Error in find", findErr });
      });
  } else {
    return res.status(400).send({ error: "Invalid in Username" });
  }
};
