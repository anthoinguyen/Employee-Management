var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
var uploadFile = require("../../services/uploadFile");
var {  } = require('../../services/returnToUsers');
var config = require('../../config');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../../routes/constants');

module.exports = router => {
  let checkInput = [
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('type').not().isEmpty()
  ]
  router.post('/', [checkPermission(constants.IS_ADMIN), uploadFile.uploadDocsFile().any(), checkInput], (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    req.files[0].link = req.files[0].destination.substring(6, req.files[0].destination.length) + req.files[0].filename;
    let insert = {
      ...req.body,
      documentName: req.files[0].filename,
      documentLink: `${config.domain}${req.files[0].link}`,
      documentLocalLink: req.files[0].link,
      postedBy: req.user._id,
    }
    mongoose.model('documents').create(insert, (err, result) => {
      if (err) throw err;
      if (result) {
        return res.redirect('/giay-to')
      }
    })
  })
}