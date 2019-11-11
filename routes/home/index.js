var router = require('express').Router();

router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('home',{roles: req.user.roles})
  } else {
    res.redirect('/users/dang-nhap')
  }
})

module.exports = router;