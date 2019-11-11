var mongoose = require('mongoose');
var constants = require('../constants');
var { errorProcess, success } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../../routes/constants');

module.exports = router => {
  router.get('/roles', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    let usersList = await mongoose.model('users').find();
    return res.render('users/roles/index', { 
      roles: req.user.roles,
      usersList
    })
  });
  router.post('/roles', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let usersList = req.body.usersList ? JSON.parse(req.body.usersList) : [];
      let roles = req.body.roles ? JSON.parse(req.body.roles) : [];
      await usersList.map(async item => {
        let update = {
          roles: []
        }
        await mongoose.model('users').findOneAndUpdate({ _id: item }, update, { new: true });
        let updateNew = {
          $push: {
            roles
          }
        }
        await mongoose.model('users').findOneAndUpdate({ _id: item }, updateNew, { new: true });
      })
      return success(res, "Done", null);
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}