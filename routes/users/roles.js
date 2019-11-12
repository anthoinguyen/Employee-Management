var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
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
  });

  router.post('/reset-password', checkPermission(constants.IS_ADMIN), (req, res, next) => {
    mongoose.model('users').findOne({ _id: req.body.id }, (err, result) => {
      if (err) errorProcess(res, err);
      if (result) {
        // Compare newPassword with reTypePassword
        if (req.body.password === req.body.rePassword) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            let query = { _id: req.body.id };
            let update = { password: hash };
            let option = { new: false };
            mongoose.model('users').findOneAndUpdate(query, update, option, (err, hander) => {
              if (err) errorProcess(res, err);
              return success(res, "Done", null)
            })
          })
        } else {
          return errorWithMess(res, false)
        }
      }else{
        return errorWithMess(res, false)
      }
    })
  })

}