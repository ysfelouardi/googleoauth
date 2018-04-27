const passport = require("passport");

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  //leting passport handle the google callbacks req
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/api/current_user");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout();
    req.user
      ? res.send(req.user)
      : res.send({
          success: "user logged out successfully"
        });
  });

  app.get("/api/current_user", (req, res) => {
    req.user
      ? res.send(req.user)
      : res.send({
          info: "logged out!"
        });
  });

  //local authentication
  app.post("/auth/local", passport.authenticate("local"), (req, res) => {
    res.redirect("/api/current_user");
  });
};
