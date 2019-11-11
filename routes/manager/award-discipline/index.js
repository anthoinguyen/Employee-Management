var mongoose = require('mongoose');
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var moment = require('moment');

module.exports = router =>{
    require("./create")(router);
    require("./edit")(router);
    require("./delete")(router);
    router.get('/khen-thuong-ky-luat', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let users = await mongoose.model('users').find({}).exec();
        let awards = await mongoose.model('awards').find({}).populate('user', constants.USER_POPULATE).exec();
        let disciplines = await mongoose.model('discipline').find({}).populate('user', constants.USER_POPULATE).exec();
        res.render('manager/award-discipline/index.ejs', {awards: awards, disciplines: disciplines, users: users, roles: req.user.roles});
    });

    router.get('/khen-thuong-ky-luat/awards/list', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        try {
            let awards = await mongoose.model('awards').find({}).populate('user', constants.USER_POPULATE).exec();
            return returnToUser.success(res, 'Ok', awards);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });
    router.get('/khen-thuong-ky-luat/discipline/list', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        try {
            let discipline = await mongoose.model('discipline').find({}).populate('user', constants.USER_POPULATE).exec();
            return returnToUser.success(res, 'Ok', discipline);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });


    router.get('/khen-thuong-ky-luat/awards/user/:user_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let user_id = req.params.user_id;
        try {
            let awards = await mongoose.model('awards').find({"user": user_id}).exec();
            if(awards == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", awards)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.get('/khen-thuong-ky-luat/discipline/user/:user_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let user_id = req.params.user_id;
        try {
            let discipline = await mongoose.model('discipline').find({"user": user_id}).exec();
            if(discipline == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", discipline)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });
    router.get('/khen-thuong-ky-luat/awards/:award_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let award_id = req.params.award_id;
        try {
            let award = await mongoose.model('awards').findOne({"_id": award_id}).populate('users', constants.USER_POPULATE).exec();
            if(award == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", award)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });
    router.get('/khen-thuong-ky-luat/discipline/:discipline_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let discipline_id = req.params.discipline_id;
        try {
            let discipline = await mongoose.model('discipline').findOne({"_id": discipline_id}).populate('users', constants.USER_POPULATE).exec();
            if(discipline == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", discipline)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });
};