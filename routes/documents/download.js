var mongoose = require('mongoose');
var { errorProcess, success } = require('../../services/returnToUsers');
var fs = require('fs');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../../routes/constants');

module.exports = router => {
  router.get('/download/:id', checkPermission(constants.IS_USER), (req, res, next) => {
    mongoose.model('documents').findOne({_id: req.params.id}, (err, result) => {
      if (err) return errorProcess(res, err);
      if (result) {
        let link = `public/${result.documentLocalLink}`
        fs.readFile(link, (err, file) => {
          if (err) return errorProcess(res, err);
          if (file) {
            return res.download(link, result.documentName)
          }
        })
      } else {
        return res.redirect('404');
      }
    })
  })
}