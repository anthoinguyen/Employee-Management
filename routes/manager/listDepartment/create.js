var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');

module.exports = router => {
  let checkInput = [
    check('name').not().isEmpty(),
    check('shortName').not().isEmpty()
  ]
  router.post('/khoa-phong', [checkPermission(constants.IS_ADMIN), checkInput], async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      let insert = {
        name: req.body.name,
        shortName: req.body.shortName
      }
      console.log(insert)
      let department = await mongoose.model('departments').create(insert);
      console.log(department)
      if (department) {
        return res.redirect('/quan-ly/khoa-phong')
      } else {
        return successWithNoData(res, "Not Done")
      }
    } catch (err) {
      return errorProcess(res, err);
    }
  })

  checkInput = [
    check('usersList').not().isEmpty(),
  ]
  router.post('/khoa-phong/them-nhan-su/:id', [checkInput, checkPermission(constants.IS_ADMIN)], async (req, res, next) => {
    try {
      // let errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(422).json({ errors: errors.array() });
      // }
      let usersList = JSON.parse(req.body.usersList)
      await usersList.map(async item => {
        let userInfo = await mongoose.model('users').findOne({ _id: item })
        let update = {
          $push: {
            memberList: {
              name: userInfo.name,
              usersCardNumber: userInfo.usersCardNumber,
              userID: userInfo._id,
              birthday: userInfo.birthday,
              userImage: userInfo.userImage,
            }
          }
        }
        let option = { new: true }
        let department = await mongoose.model('departments').findOneAndUpdate({ _id: req.params.id }, update, option)
        let updateUser = {
          belongToDepartment: {
            name: department.name,
            departmentID: department._id
          },
        }
        await mongoose.model('users').findOneAndUpdate({ _id: userInfo._id }, updateUser, option)
      })
      let addRoles = { 
        $push: {
          roles: constants.IS_ADMIN_DEPARTMENT
        }
      }
      
      // update = Object.assign({}, updateUser, isManager ? addRoles : {})
      return success(res, "Done", null);
    } catch (err) {
      console.log(err);
      return errorProcess(res, err);
    }
  })
}