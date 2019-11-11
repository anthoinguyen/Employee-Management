var mongoose = require('mongoose');
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
let calculate = require('./calculate');

module.exports = router =>{
    require("./create")(router);
    require("./edit")(router);
    require("./delete")(router);

    router.get('/luong-phu-cap', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let salary = await mongoose.model('salary').find({})
            .populate('user', constants.USER_POPULATE)
            .populate('ngach')
            .exec();
        let settings = await mongoose.model('settings').findOne({}).exec();
        let re = await salary.map((item, i, list) => {
            let tongLuong = calculate(settings, item._doc);
            return {
                ...item._doc,
                luongCoBan: settings.luongCoBan,
                tongLuong: tongLuong
            };
        });
        res.render('manager/salary/index.ejs', {salary: re, roles: req.user.roles})
    });

    router.get('/luong-phu-cap/list', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        try {
            let salary = await mongoose.model('salary').find({})
                .populate('user', constants.USER_POPULATE)
                .populate('ngach')
                .exec();
            let settings = await mongoose.model('settings').findOne({}).exec();
            let re = await salary.map((item, i, list) => {
                let tongLuong = calculate(settings, item._doc);
                return {
                   ...item._doc,
                   luongCoBan: settings.luongCoBan,
                   tongLuong: tongLuong
                };
            });
            return returnToUser.success(res, 'Ok', re);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.get('/luong-phu-cap/:salary_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let salary_id = req.params.salary_id;
        try {
            let salary = await mongoose.model('salary').findOne({"_id": salary_id})
                .populate('user', constants.USER_POPULATE)
                .populate('ngach')
                .exec();
            if(salary == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                let settings = await mongoose.model('settings').findOne({}).exec();
                let tongLuong = calculate(settings, salary._doc);
                let re = {
                    ...salary._doc,
                    luongCoBan: settings.luongCoBan,
                    tongLuong: tongLuong
                };
                return returnToUser.success(res, "Thành công!", re)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.get('/luong-phu-cap/user/:user_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let user_id = req.params.user_id;
        try {
            let salary = await mongoose.model('salary').findOne({"user": user_id})
                .populate('user', constants.USER_POPULATE)
                .populate('ngach')
                .exec();
            if(salary == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                let settings = await mongoose.model('settings').findOne({}).exec();
                let tongLuong = calculate(settings, salary._doc);
                let re = {
                    ...salary._doc,
                    luongCoBan: settings.luongCoBan,
                    tongLuong: tongLuong
                };
                return returnToUser.success(res, "Thành công!", re)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    })

}