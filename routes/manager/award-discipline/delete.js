var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');
var moment = require('moment');

module.exports = router =>{
    router.delete('/khen-thuong-ky-luat/awards/:id',  checkPermission(constants.IS_ADMIN) , (req, res, next) => {
        let award_id = req.params.id;
        try {
            mongoose.model('awards').findOneAndDelete({"_id": award_id}, (err, data) => {
                if(err) return returnToUser.errorProcess(res, err);
                if(data) {
                    return returnToUser.success(res, "Xóa thành công!", data);
                } else {
                    return returnToUser.errorWithMess(res, "Không tồn tại hoặc đã bị xóa!");
                }
            });
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    })
    router.delete('/khen-thuong-ky-luat/discipline/:id',  checkPermission(constants.IS_ADMIN) , (req, res, next) => {
        let discipline_id = req.params.id;
        try {
            mongoose.model('discipline').findOneAndDelete({"_id": discipline_id}, (err, data) => {
                if(err) return returnToUser.errorProcess(res, err);
                if(data) {
                    return returnToUser.success(res, "Xóa thành công!", data);
                } else {
                    return returnToUser.errorWithMess(res, "Không tồn tại hoặc đã bị xóa!");
                }
            });
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    })
}