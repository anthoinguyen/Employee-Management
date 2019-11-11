var mongoose = require('mongoose');
var _ = require("lodash");
let returnToUser = require('../../services/returnToUsers');
let {checkPermission} = require('../../services/checkPermission');
let constants = require('../../routes/constants');
let calculate = require('../manager/salary/calculate');
var moment = require('moment');

module.exports = router => {
    router.get('/', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        let user_id = user._id;
        let re = null;
        let salary = await mongoose.model('salary').findOne({"user": user_id})
            .populate('user', constants.USER_POPULATE)
            .populate('ngach')
            .exec();
        if(salary !== null) {
            let settings = await mongoose.model('settings').findOne({}).exec();
            let tongLuong = calculate(settings, salary._doc);
            re = {
                ...salary._doc,
                luongCoBan: settings.luongCoBan,
                tongLuong: tongLuong
            };
        }
        res.render('employee-information', {user: user, salary: re, roles: req.user.roles})
    });
    router.get('/luong-phu-cap', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        let user_id = user._id;
        let re = null;
        try{
            let salary = await mongoose.model('salary').findOne({"user": user_id})
                .populate('user', constants.USER_POPULATE)
                .populate('ngach')
                .exec();
            if(salary !== null) {
                let settings = await mongoose.model('settings').findOne({}).exec();
                let tongLuong = calculate(settings, salary._doc);
                re = {
                    ...salary._doc,
                    luongCoBan: settings.luongCoBan,
                    tongLuong: tongLuong
                };
                return returnToUser.success(res, 'Thành công!', re);
            } else {
                return returnToUser.errorWithMess(res, 'Không tìm thấy');
            }
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    })
}
