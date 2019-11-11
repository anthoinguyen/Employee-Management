var mongoose = require('mongoose');
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var moment = require('moment');

module.exports = router =>{
    require("./createProfile")(router);
    require("./profileWaiting")(router);
    require("./search")(router);
    require("./editProfile")(router);

    router.get('/danh-sach-nhan-su', checkPermission(constants.IS_USER), async (req, res, next) => {
        let users = await mongoose.model('users').find({}).exec();
        let waiting = await mongoose.model('profilesWaiting').find({}).populate('user', constants.USER_POPULATE).exec();

        let nhansu = {};
        nhansu.nhanVien = await mongoose.model('users').find({"cuuNhanVien": false}).exec();
        nhansu.dangVien = await mongoose.model('users').find({"communist.yes": true}).exec();
        nhansu.doanVien = await mongoose.model('users').find({"youthUnion.yes": true}).exec();
        nhansu.cuuNhanVien = await mongoose.model('users').find({"cuuNhanVien": true}).exec();
        res.render('manager/listEmployee/index.ejs', {data: users, waiting: waiting, roles: req.user.roles , nhansu})
      });

    router.get('/danh-sach-nhan-su/list', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        try {
            let users = await mongoose.model('users').find({}).exec();
            return returnToUser.success(res, 'Thành công!', users);
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.get('/danh-sach-nhan-su/get/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        try {
            let user = await mongoose.model('users').findById(req.params.id).exec();
            if(user == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy user với id trên!');
            } else {
                return returnToUser.success(res, "Thành công!", user)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });
    router.delete('/danh-sach-nhan-su/xoa/:id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        mongoose.model('users').findByIdAndRemove(req.params.id, (err, result) => {
            if(err) return returnToUser.errorProcess(res, err);
            else if(result == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.successWithNoData(res, 'Xóa thành công');
            }
        });
    });
};