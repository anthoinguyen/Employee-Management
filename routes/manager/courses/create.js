var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');
var moment = require('moment');

module.exports = router =>{
    router.post('/dao-tao/them',  checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let users = JSON.parse(req.body.users);
        let courses = await users.map((userID, i, users) => {
            return {
                ...req.body,
                user: userID
            }
        });
        mongoose.model('courses').insertMany(courses, (err, data) => {
            if(err)
                return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, "Thành công!", data);
        });
    });
};