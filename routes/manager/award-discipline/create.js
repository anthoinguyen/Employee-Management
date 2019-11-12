var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');
var moment = require('moment');

module.exports = router =>{
    router.post('/khen-thuong-ky-luat/awards/them',  checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let users = JSON.parse(req.body.users);
        let awards = await users.map((userID, i, users) => {
            return {
                ...req.body,
                quyetDinh: JSON.parse(req.body.quyetDinh),
                user: userID
            }
        });
        mongoose.model('awards').insertMany(awards, (err, data) => {
            if(err)
                return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, "Thành công!", data);
        });
    });
    router.post('/khen-thuong-ky-luat/discipline/them',  checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let users = JSON.parse(req.body.users);
        let discipline = await users.map((userID, i, users) => {
            return {
                ...req.body,
                quyetDinh: JSON.parse(req.body.quyetDinh),
                user: userID
            }
        });
        mongoose.model('discipline').insertMany(discipline, (err, data) => {
            if(err)
                return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, "Thành công!", data);
        });
    })
}