var mongoose = require('mongoose');
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');

module.exports = router => {
  router.get("/khoa-phong", checkPermission(constants.IS_USER), async (req, res, next) => {
    let departments = await mongoose.model('departments').find();
    res.render("manager/listDepartment", {
      departments,
      roles: req.user.roles
    });
  });
}