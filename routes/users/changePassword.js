var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var { success, errorProcess, errorWithMess } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../../routes/constants');

module.exports = router => {
  router.get('/doi-mat-khau', checkPermission(constants.IS_USER), async (req, res, next) => {
    return res.render('users/changePassword')
  });

  router.post('/doi-mat-khau', checkPermission(constants.IS_USER), (req, res, next) => {
    mongoose.model('users').findOne({ email: req.user.email }, (err, result) => {
      bcrypt.compare(req.body.oldPassword, result.password, (err, isMatch) => {
        if (err) errorProcess(res, err);
        if (isMatch) {
          // Compare newPassword with reTypePassword
          if (req.body.password === req.body.rePassword) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              let query = { email: req.user.email };
              let update = { password: hash };
              let option = { new: false };
              mongoose.model('users').findOneAndUpdate(query, update, option, (err, hander) => {
                if (err) errorProcess(res, err);
                req.logout();
                return success(res, "Done", null)
              })
            })
          } else {
            return errorWithMess(res,"Mật khẩu không khớp. Vui lòng nhập lại" ,null)
          }
        } else {
          // Type wrongpassword
          return errorWithMess(res,"Mật khẩu cũ không đúng. Vui lòng nhập lại",null)
        }
      })
    })
  })
}