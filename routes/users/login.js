var passport = require("passport");

module.exports = router => {
  router.get("/dang-nhap", (req, res, next) => {
    res.render("users/login");
  });

  //Method POST
  router.post(
    "/dang-nhap",
    passport.authenticate("local", {
      failureRedirect: "/users/dang-nhap",
      failureFlash: true
    }),
    (req, res, next) => {
      if (req.body.remember) {
        req.session.cookie.maxAge = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ); // Cookie expires after 30 days
      } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
      }
      res.redirect("/");
    }
  );
};
