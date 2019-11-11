var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');

module.exports = router =>{
    require("./create")(router);
    require("./edit")(router);
    require("./delete")(router);

    router.get('/danh-muc-luong', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let systemSalary = await mongoose.model('systemSalary').find({}).exec();
        let settings = await mongoose.model('settings').findOne({}).exec();
        res.render('system/systemSalary/index.ejs', {systemSalary: systemSalary, roles: req.user.roles, settings: settings})
    });
    router.get('/luong/list', async (req, res, next) => {
        try {
            let systemSalary = await await mongoose.model('systemSalary').find({}).exec();
            return returnToUser.success(res, 'Ok', systemSalary);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });
    router.get('/luong/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let id = req.params.id;
        try {
            let systemSalary = await mongoose.model('systemSalary').findOne({"_id": id}).exec();
            if(systemSalary == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", systemSalary)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    })
}