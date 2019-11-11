var mongoose = require('mongoose');
var { errorProcess } = require('../../../services/returnToUsers');
var { checkPermission } = require('../../../services/checkPermission');
var constants = require('../../constants');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');

module.exports = router => {
    require("./luongCoBan")(router);

    router.get('/cai-dat', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        try {
            let settings = await mongoose.model('settings').findOne({});
            return returnToUser.success(res, '', settings);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });
};