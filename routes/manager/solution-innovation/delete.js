var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');

module.exports = router =>{
    router.delete('/giai-phap-sang-kien/:solution_id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        let solution_id = req.params.solution_id;
        try {
            mongoose.model('solution').findOneAndDelete({"_id": solution_id}, (err, data) => {
                if(err) return returnToUser.errorProcess(res, err);
                if(data) {
                    return returnToUser.success(res, "Xóa thành công!", data);
                } else {
                    return returnToUser.errorWithMess(res, "Không tồn tại hoặc đã bị xóa!");
                }
            });
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    })
}