var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var moment = require('moment');


module.exports = router => {
  router.delete('/lam-them-gio/:id', async (req, res, next) => {
    try {
      let workOverTime = await mongoose.model('workOverTime').findOneAndDelete({ _id: req.params.id });
      return success(res, "Done", workOverTime)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}