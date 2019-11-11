var mongoose = require('mongoose');
var { errorProcess, success } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission');
var constants = require('../constants');
const { check, validationResult } = require("express-validator/check");
var { create } = require('../manager/day-off/createCourseYear');

module.exports = router => {
  let checkInput = [
    check('courseYear').not().isEmpty(),
    check('totalDateAllow').not().isEmpty()
  ]
  router.post('/create-new-year', [checkPermission(constants.IS_ADMIN), checkInput], async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let newCourseYear = await mongoose.model('courseYear').create({ courseYear: req.body.courseYear })
      let users = await mongoose.model('absence').find();
      success(res, "Done", null)
      await users.map((item) => {
        let update = {
          $push: {
            year: {
              coursYear: req.body.coursYear,
              coursYearId: newCourseYear._id,
              totalDateAllow: req.body.totalDateAllow ? req.body.totalDateAllow : 12
            }
          }
        };
        let option = { new: false }
        mongoose.model('absence').findOneAndUpdate({ _id: item._id }, update, option)
      })
    } catch (err) {
      return errorProcess(res, err);
    }
    
  })
}