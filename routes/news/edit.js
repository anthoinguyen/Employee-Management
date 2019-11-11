var mongoose = require('mongoose');
var { success, successWithNoData, errorProcess } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../constants');
var uploadFile = require("../../services/uploadFile");
var _ = require('lodash');

module.exports = router => {
  router.put('/:id', checkPermission(constants.IS_ADMIN), uploadFile.uploadDocsFile().any(), async (req, res, next) => {
    try {
      let update = {
        ...req.body,
      }
      if (!_.isEmpty(req.files)) {
        req.files[0].link = req.files[0].destination.substring(6, req.files[0].destination.length) + req.files[0].filename;
        update['attached'] = `${config.domain}${req.files[0].link}`;
      }
      let option = { new: true };
      let news = await mongoose.model('news').findOneAndUpdate({ _id: req.params.id }, update, option)
      return success(res, "Done", news)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}