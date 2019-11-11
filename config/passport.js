var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

module.exports = (passport, LocalStrategy) => {
  // passport config

  // Serialize user for session
  // When user login to system at the first time, passport will store their sessions via _id.
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  // When user login to system at the second time, passport will find id in session and return their user info.
  passport.deserializeUser((id, done) => {
    mongoose.model("users").findById(id, (err, user) => {
      if (err) done(err);

      if (user) {
        user.password = null;
        done(err, user);
      }
    });
  });

  passport.use(
    "local",
    new LocalStrategy((username, password, done) => {
      // console.log('username', username)
      // console.log('password', password)
      mongoose.model("users").findOne({ email: username }, (err, userDoc) => {
        if (err) done(err);
        // console.log('userDoc', userDoc);
        if (userDoc) {
          bcrypt.compare(password, userDoc.password, (err, isMatch) => {
            if (err) console.log(err);
            if (isMatch) {
              userDoc.password = null;
              return done(null, userDoc);
            }
            // If password is wrong
            return done(null, false);
          });
        }
        // If cannot find user
        else return done(null, false);
      });
    })
  );
};
