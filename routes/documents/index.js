var router = require('express').Router();
var mongoose = require('mongoose');
var { success, successWithNoData } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../../routes/constants');

router.get('/', checkPermission(constants.IS_USER), (req, res, next) => {
  mongoose.model('documents').find().populate('type').exec((err, documentList) => {
    if (err) throw err;
    if (documentList) {
      res.render('documents', {
        documentList: documentList ? documentList : [],
        roles: req.user.roles
      });
    }
  })
})

router.get('/type-of-documents', checkPermission(constants.IS_USER), (req, res, next) => {
  mongoose.model('typeOfDocuments').find().exec((err, result) => {
    if (result) {
      return success(res, "Done", result)
    } else {
      return successWithNoData(res, "Done")
    }
  })
})

require('./list')(router);

require('./createNewDocuments')(router);

require('./delete')(router);

require('./edit')(router);

require('./download')(router);

module.exports = router;