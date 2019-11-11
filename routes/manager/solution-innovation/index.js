var mongoose = require('mongoose');
let returnToUser = require('../../../services/returnToUsers');
let {checkPermission} = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');

module.exports = router => {
    require("./create")(router);
    require("./edit")(router);
    require("./delete")(router);

    router.get('/giai-phap-sang-kien', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let users = await mongoose.model('users').find({}).exec();
        let solutions = await mongoose.model('solution').find({}).populate('user', constants.USER_POPULATE).exec();
        res.render('manager/solution-innovation/index.ejs', {solutions: solutions, users: users, roles: req.user.roles});
    });

    router.get('/giai-phap-sang-kien/list', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        try {
            let solutions = await mongoose.model('solution').find({}).populate('user', constants.USER_POPULATE).exec();
            return returnToUser.success(res, 'Ok', solutions);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.get('/giai-phap-sang-kien/:solution_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let solution_id = req.params.solution_id;
        try {
            let solution = await mongoose.model('solution').findOne({"_id": solution_id}).populate('user', constants.USER_POPULATE).exec();
            if(solution == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", solution)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.get('/giai-phap-sang-kien/user/:user_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let user_id = req.params.user_id;
        try {
            let solutions = await mongoose.model('solution').find({"user": user_id}).exec();
            if(solutions == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", solutions);
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });
};