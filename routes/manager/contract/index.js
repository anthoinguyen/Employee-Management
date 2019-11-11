var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
var _ = require('lodash');
var moment = require('moment');
var { checkPermission } = require('../../../services/checkPermission');
var constants = require('../../constants');

module.exports = router =>{
  require('./getData')(router);
  require('./renew')(router);
  require('./create')(router);
  require('./endContract')(router);

  router.get('/hop-dong-lao-dong', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    let result = await mongoose.model('contract').find();
    let current = [];
    let expired = [];
    let nearlyExpired = [];
    await result.map(item => {
      let info = item.detail[item.detail.length - 1];

      if (!_.isEmpty(info)) {
        if (info.dateExpired == null) {
          current.push({
            ...item,
            detail: [info]
          })
        }
        if (moment(info.dateExpired) >= moment()) {
          current.push({
            ...item,
            detail: [info]
          })
        }
        if (moment(info.dateExpired) < moment()) {
          expired.push({
            ...item,
            detail: [info]
          })
        }
        if (moment(info.dateExpired) >= moment() && moment(info.dateExpired) <= moment().set('month', moment().get('month') + 3)) {
          nearlyExpired.push({
            ...item,
            detail: [info]
          })
        }
      }
    })

    return res.render('manager/contract', {
      current,
      expired,
      nearlyExpired,
      roles: req.user.roles
    })
  })
}