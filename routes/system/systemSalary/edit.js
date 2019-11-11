var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');

module.exports = router =>{
    router.put('/luong/:id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        let id = req.params.id;
        let bacHeso = req.body.bacHeso;

        try {
            let update = {
                ...req.body,
                _id: id,
                bacHeso: JSON.parse(bacHeso)
            };
            mongoose.model('systemSalary').findOneAndUpdate({"_id": id}, {$set: update}, {new: true},(err, data) => {
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