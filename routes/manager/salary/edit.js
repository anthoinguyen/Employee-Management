var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');

module.exports = router =>{
    router.put('/luong-phu-cap/:salary_id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        let salary_id = req.params.salary_id;
        let user_id = req.body.user;
        let ngach_id = req.body.ngach;
        let bac_id = req.body.bacHeso;
        let phuCap = req.body.phuCap;

        try {
            let update = {
                ...req.body,
                _id: salary_id,
                user: user_id,
                ngach: ngach_id,
                bacHeso: bac_id,
                phuCap: JSON.parse(phuCap)
            };
            mongoose.model('salary').findOneAndUpdate({"_id": salary_id}, {$set: update}, {new: true},(err, data) => {
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