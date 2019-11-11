var mongoose = require('mongoose');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../constants');

module.exports = router => {
  router.get('/phan-muc-tin-tuc', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    let category = await mongoose.model('newsCategory').find();
    return res.render('category', { category, roles: req.user.roles })
  })
}