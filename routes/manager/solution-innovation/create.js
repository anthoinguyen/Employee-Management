var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');

module.exports = router =>{
    router.post('/giai-phap-sang-kien/them',  checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let users = JSON.parse(req.body.users);
        let solutions = await users.map((userID, i, users) => {
            return {
                ...req.body,
                user: userID
            }
        });
        mongoose.model('solution').insertMany(solutions, (err, data) => {
            if(err)
                return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, "Thành công!", data);
        });
    });
};