var mongoose = require('mongoose');
var { success, successWithNoData, errorProcess } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../constants');

module.exports = router => {
  router.get('/phan-loai', checkPermission(constants.IS_ADMIN) ,async (req, res, next) => {
    let typeOfDocuments = await mongoose.model('typeOfDocuments').find();
    return res.render('typeOfDocuments', {
      roles: req.user.roles,
      typeOfDocuments: typeOfDocuments ? typeOfDocuments : []
    })
  })

  router.get('/phan-loai/:id', checkPermission(constants.IS_ADMIN) ,async (req, res, next) => {
    try {
      let typeOfDocuments = await mongoose.model('typeOfDocuments').findOne({ _id: req.params.id });
      return success(res, "Done", typeOfDocuments)
    } catch (err) {
      return errorProcess(res, err);
    }
  })

  router.post('/phan-loai', checkPermission(constants.IS_ADMIN) ,async (req, res, next) => {
    try {
      let insert = {
        ...req.body
      }
      await mongoose.model('typeOfDocuments').create(insert)
      return res.redirect('/giay-to/phan-loai');
    } catch (err) {
      next();
    }
  })

  router.put('/phan-loai/:id', checkPermission(constants.IS_ADMIN) ,async (req, res, next) => {
    try {
      let update = {
        ...req.body
      }
      let option = { new: true }
      let typeOfDocuments = await mongoose.model('typeOfDocuments').findOneAndUpdate({ _id: req.params.id }, update, option)
      return success(res, "Done", typeOfDocuments)
    } catch (err) {
      return errorProcess(res, err);
    }
  })

  router.delete('/phan-loai/:id', checkPermission(constants.IS_ADMIN) ,async (req, res, next) => {
    try {
      let typeOfDocuments = await mongoose.model('typeOfDocuments').findOneAndRemove({ _id: req.params.id });
      return success(res, "Done", typeOfDocuments)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}