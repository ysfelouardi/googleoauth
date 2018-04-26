const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
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
