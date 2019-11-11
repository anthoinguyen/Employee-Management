var { success, errorProcess } = require('../../services/returnToUsers');
var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
var { checkPermission } = require('../../services/checkPermission');
var constants = require('../constants');
var _ = require('lodash');

module.exports = router => {
  let checkInput = [
    check('to').not().isEmpty(),
    check('title').not().isEmpty(),
    check('content').not().isEmpty(),
  ]
  router.post('/thong-bao', [checkInput, checkPermission(constants.IS_USER)], async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await mongoose.model('users').findOne({ _id: to })
      let insert = {
        from: req.user._id,
        fromName: req.user.name,
        to: req.body.to,
        title: _.get(req.body, 'title', ""),
        content: _.get(req.body, 'content', ""),
      }
      let notifies = await mongoose.model('notifies').create(insert);
      return success(res, "Done", notifies)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}