var mongoose = require('mongoose');
var _ = require("lodash");
let returnToUser = require('../../services/returnToUsers');
let {checkPermission} = require('../../services/checkPermission');
let constants = require('../../routes/constants');
var moment = require('moment');

module.exports = router => {
    router.get('/khen-thuong', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        try {
            let awards = await mongoose.model('awards').find({"user": user._id}).exec();
            if(awards == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", awards)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });
    router.post('/khen-thuong', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        let quyetDinh = req.body.quyetDinh;
        let push = {
            ...req.body,
            user: user,
            quyetDinh: JSON.parse(quyetDinh),
        };
        await mongoose.model('awards').create(push,  async (err, data) => {
            if(err) return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, 'Ok', data);
        });
    });

    router.get('/khen-thuong/:award_id', checkPermission(constants.IS_USER), async (req, res, next) => {
        let award_id = req.params.award_id;
        let user = req.user;
        try {
            let award = await mongoose.model('awards').findOne({"_id": award_id, "user": user._id}).exec();
            if(award == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", award)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.put('/khen-thuong/:award_id', checkPermission(constants.IS_USER), async (req, res, next) => {
        let award_id = req.params.award_id;
        let user = req.user;
        let quyetDinh = req.body.quyetDinh;
        try {
            let update = {
                ...req.body,
                _id: award_id,
                user: user,
                quyetDinh: JSON.parse(quyetDinh),
            };
            await mongoose.model('awards').findOneAndUpdate({"_id": award_id, "user": user._id}, {$set: update}, {new: true},(err, data) => {
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

    router.delete('/khen-thuong/:award_id', checkPermission(constants.IS_USER), (req, res, next) => {
        let award_id = req.params.award_id;
        let user = req.user;
        try {
            mongoose.model('awards').findOneAndDelete({"_id": award_id, "user": user._id}, (err, data) => {
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
