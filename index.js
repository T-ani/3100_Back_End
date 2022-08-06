const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const signUpHandler = require("./Route_Handlers/SignUp/signup");
const app = express();
app.use(express.json());
app.use(cors());

//database connection using mongoose
mongoose
  .connect("mongodb://localhost/Med-Finder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to Database is succesful"))
  .catch((err) => console.log(err));

//application routes

app.use("/signUp", signUpHandler);
// app.use("/user", userHandler);

//error handeling Middleware
const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

//Starting our server
app.listen(3010, () => {
  console.log("App is listening at PORT 3010");
});
