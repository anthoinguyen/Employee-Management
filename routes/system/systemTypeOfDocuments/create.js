var mongoose = require('mongoose');
var { success, errorProcess, successWithNoData } = require('../../../services/returnToUsers');
const { check, validationResult } = require("express-validator/check");

module.exports = router => {
  let checkInput = [
    check('name').not().isEmpty()
  ]
  router.post('/loai-giay-to', [checkInput], async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let typeOfDocuments = await mongoose.model('typeOfDocuments').create({ name: req.body.name })
      return success(res, "Done", typeOfDocuments)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}