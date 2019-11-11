var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');

module.exports = router =>{
    router.post('/luong/them', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let bacHeso = req.body.bacHeso;
        let push = {
            ...req.body,
            bacHeso: JSON.parse(bacHeso)
        };
        await mongoose.model('systemSalary').create(push,  async (err, data) => {
            if(err) return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, 'Ok', data);
        });
    });
};