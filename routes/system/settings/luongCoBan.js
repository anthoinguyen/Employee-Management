var mongoose = require('mongoose');
var { errorProcess } = require('../../../services/returnToUsers');
var { checkPermission } = require('../../../services/checkPermission');
var constants = require('../../constants');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');

module.exports = router => {
    router.put('/cai-dat/luong-co-ban', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let luong = req.body.luongCoBan;
        let update = {
            luongCoBan: luong
        };
        try {
            let settings = await mongoose.model('settings').findOneAndUpdate({}, {$set: update}, {new: true}).exec();
            return returnToUser.success(res, '', settings);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });
};