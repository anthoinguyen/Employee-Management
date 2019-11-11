var mongoose = require('mongoose');
var { success, errorProcess } = require('../../../services/returnToUsers');
var moment = require('moment');
var { checkPermission } = require('../../../services/checkPermission');
var constants = require('../../constants');

module.exports = router => {
  router.delete('/hop-dong-lao-dong/end/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let currentContract = await mongoose.model('contract').findOne({ usersId: req.params.id });
      let update = {
        $set: {
          'detail.$[contractId].beginEnd': true,
          'detail.$[contractId].dateExpired': moment(),
        }
      }
      let option = { new: true, arrayFilters: [{
        "contractId._id": mongoose.Types.ObjectId(`${currentContract.detail[currentContract.detail.length - 1]._id}`)
      }], multi: false };
      console.log(update)
      let usersContract = await mongoose.model('contract').findOneAndUpdate({ usersId: req.params.id }, update, option);
      let update1 = { password: null }
      let option1 = { new: true }
      let updatePassword = await mongoose.model('users').findOneAndUpdate({ _id: req.params.id }, update1, option1);
      return success(res, "Done", usersContract)
    } catch(err) {
      return errorProcess(res, err);
    }
  })
}