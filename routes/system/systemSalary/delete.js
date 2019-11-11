var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');

module.exports = router =>{
    router.delete('/luong/:id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        let id = req.params.id;
        try {
            mongoose.model('systemSalary').findOneAndDelete({"_id": id}, (err, data) => {
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