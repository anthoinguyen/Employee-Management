var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');
var moment = require('moment');

module.exports = router =>{
    router.put('/khen-thuong-ky-luat/awards/:id',  checkPermission(constants.IS_ADMIN) , (req, res, next) => {
        let award_id = req.params.id;
        try {
            let update = {
                ...req.body,
                quyetDinh: JSON.parse(req.body.quyetDinh),
                _id: award_id
            };
            mongoose.model('awards').findByIdAndUpdate(award_id, {$set: update}, {new: true},(err, data) => {
                if(err)
                    return returnToUser.errorProcess(res, err);
                else if(data == null)
                    return returnToUser.errorProcess(res, 'Không tìm thấy!');
                else {
                    return returnToUser.success(res, "Thành công!", data);
                }
            });
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    })
    router.put('/khen-thuong-ky-luat/discipline/:id',  checkPermission(constants.IS_ADMIN) , (req, res, next) => {
        let discipline_id = req.params.id;
        try {
            let update = {
                ...req.body,
                quyetDinh: JSON.parse(req.body.quyetDinh),
                _id: discipline_id
            };
            mongoose.model('discipline').findByIdAndUpdate(discipline_id, {$set: update}, {new: true},(err, data) => {
                if(err)
                    return returnToUser.errorProcess(res, err);
                else if(data == null)
                    return returnToUser.errorProcess(res, 'Không tìm thấy!');
                else {
                    return returnToUser.success(res, "Thành công!", data);
                }
            });
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    })
}