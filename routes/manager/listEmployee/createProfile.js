var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');


module.exports = router =>{
  router.get('/tao-ho-so', checkPermission(constants.IS_ADMIN),(req, res, next) => {
    res.render('manager/listEmployee/createProfile.ejs',{roles: req.user.roles})
  });

    let checkInput = [
        check('name').not().isEmpty(),
        check('email').not().isEmpty(),
        check('password').not().isEmpty(),
    ]

  router.post('/tao-ho-so', [checkPermission(constants.IS_ADMIN), checkInput],(req, res, next) => {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }
      mongoose.model('users').findOne({'email': req.body.email}, (err, data) => {
          if(data == null) {
              bcrypt.hash(req.body.password, 10, async (err, passHash) => {
                  let user_info = {
                      ...req.body,
                      placeBirth: JSON.parse(req.body.placeBirth),
                      hometown: JSON.parse(req.body.hometown),
                      educationLevel: JSON.parse(req.body.educationLevel),
                      communist: JSON.parse(req.body.communist),
                      ngayThamGiaToChucCTXH: JSON.parse(req.body.ngayThamGiaToChucCTXH),
                      army: JSON.parse(req.body.army),
                      // award: JSON.parse(req.body.award),
                      // discipline: JSON.parse(req.body.discipline),
                      health: JSON.parse(req.body.health),
                      veterans: JSON.parse(req.body.veterans),
                      IDCard: JSON.parse(req.body.IDCard),
                    // socialInsuranceNumber: JSON.parse(req.body.socialInsuranceNumber),
                      // course: JSON.parse(req.body.course),
                      youthUnion: JSON.parse(req.body.youthUnion),
                      workingProccess: JSON.parse(req.body.workingProccess),
                      personalHistory: JSON.parse(req.body.personalHistory),
                      familyRelationship: JSON.parse(req.body.familyRelationship),
                      wageMovements: JSON.parse(req.body.wageMovements),
                      // laborContract: JSON.parse(req.body.laborContract),
                      // belongToDepartment: JSON.parse(req.body.belongToDepartment),
                      password: passHash,
                      roles: constants.IS_USER
                  };
                  let u = await mongoose.model('users').create(user_info);
                  return returnToUser.success(res, 'Tạo thành công', u)
              });
          } else {
              return returnToUser.errorWithMess(res, 'Email bị trùng!')
          }
      });
  })
}