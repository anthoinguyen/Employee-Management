var mongoose = require('mongoose');
var _ = require("lodash");
let returnToUser = require('../../../services/returnToUsers');
let {checkPermission} = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');

module.exports = router => {
    require('./communist')(router);
    require('./employees')(router);
    require('./solutions')(router);
    require('./personal')(router);
    router.get('/', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        res.render('report-statistic/report/index', { roles: req.user.roles });
    });
};
