module.exports = router => {
  router.get('/dang-xuat', (req, res, next) => {
    req.logout();
    res.redirect('/users/dang-nhap');
  })
}