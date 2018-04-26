const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");

//connecting to database
mongoose.connect(keys.mongoURI);
//user model
require("./models/User");
//passport config
require("./services/passport");

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKEY]
  })
);
app.use(passport.initialize());
app.use(passport.session());
//for logging
app.use(morgan("dev"));

//routes
require("./routes/user.route")(app);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port} ...`));
