var mongoose = require('mongoose');
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var moment = require('moment');

module.exports = router =>{

    require("./create")(router);
    require("./edit")(router);
    require("./delete")(router);

    router.get('/dao-tao', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let users = await mongoose.model('users').find({}).exec();
        let courses = await mongoose.model('courses').find({}).populate('user', constants.USER_POPULATE).exec();
        res.render('manager/courses/index.ejs', {users: users, courses: courses, roles: req.user.roles });
    });

    router.get('/dao-tao/list', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        try {
            let courses = await mongoose.model('courses').find({}).populate('user', constants.USER_POPULATE).exec();
            return returnToUser.success(res, 'Ok', courses);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.get('/dao-tao/:course_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let course_id = req.params.course_id;
        try {
            let course = await mongoose.model('courses').findOne({"_id": course_id}).populate('user', constants.USER_POPULATE).exec();
            if(course == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", course)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    })


    router.get('/dao-tao/user/:user_id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let user_id = req.params.user_id;
        try {
            let courses = await mongoose.model('courses').find({"user": user_id}).exec();
            if(courses == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", courses);
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

}