module.exports = router => {
  router.get("/dang-xuat", (req, res, next) => {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if (err) {
          return next(err);
        } else {
          req.session = null;
          return res.redirect("/");
        }
      });
    }
  });
};
