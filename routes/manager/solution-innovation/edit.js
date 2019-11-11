var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');

module.exports = router =>{
    router.put('/giai-phap-sang-kien/:solution_id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        let solution_id = req.params.solution_id;
        // let user = req.body.user;
        try {
            let update = {
                ...req.body,
                _id: solution_id,
                // user: user,
            };
            mongoose.model('solution').findOneAndUpdate({"_id": solution_id}, {$set: update}, {new: true},(err, data) => {
                if(err)
                    return returnToUser.errorProcess(res, err);
                else if(data == null)
                    return returnToUser.errorProcess(res, 'Không tìm thấy!');
                else {
                    return returnToUser.success(res, "Cập nhật thành công!", data);
                }
            });
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    })
}