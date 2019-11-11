var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');

module.exports = router =>{
    /* POST lên theo mẫu sau:
    {
        user: 'user_id',
        ngach: 'ngach_id',
        ...
        phuCap: JSON.stringify(xxx)
    }

    */
    router.post('/luong-phu-cap/them', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let user_id = req.body.user;
        let ngach_id = req.body.ngach;
        let bac = req.body.bacHeso;
        let phuCap = req.body.phuCap;

        let check = await mongoose.model('salary').findOne({"user": user_id}).exec();
        if(check != null) {
            return returnToUser.errorWithMess(res, 'Lương của người dùng này đã tồn tại!')
        }
        let push = {
            ...req.body,
            user: user_id,
            ngach: ngach_id,
            bacHeso: bac,
            phuCap: JSON.parse(phuCap)
        };
        await mongoose.model('salary').create(push,  async (err, data) => {
            if(err) return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, 'Ok', data);
        });
    });
};