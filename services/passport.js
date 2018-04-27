const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId).then(user => {
    done(null, user);
  });
});
//googleStrategy
passport.use(
  new googleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refrechToken, profile, done) => {
      //if the user exist skip creation
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          return done(null, existingUser);
        }

        //create a new record
        new User({
          username: profile.displayName,
          fullname: profile.name.givenName,
          googleId: profile.id
        })
          .save()
          .then(newuser => {
            return done(null, newuser);
          });
      });
    }
  )
);

//localStrategy
passport.use(
  new localStrategy((username, password, done) => {
    //if user dosen't exist create a record
    User.findOne({ username: username }).then(existingUser => {
      if (existingUser) {
        //comparing passwords
        bcrypt.compare(password, existingUser.password, (err, result) => {
          return result ? done(null, existingUser) : done(null, false);
        });
      } else {
        bcrypt.hash(password, 10, (err, hash_pass) => {
          // Store the record in the db
          new User({
            username: username,
            password: hash_pass
          })
            .save()
            .then(newuser => {
              return done(null, newuser);
            });
        });
      }
    });
  })
);
