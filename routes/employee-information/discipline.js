var mongoose = require('mongoose');
var _ = require("lodash");
let returnToUser = require('../../services/returnToUsers');
let {checkPermission} = require('../../services/checkPermission');
let constants = require('../../routes/constants');

module.exports = router => {
    router.get('/ky-luat', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        try {
            let discipline = await mongoose.model('discipline').find({"user": user._id}).exec();
            if(discipline == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", discipline)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });
    router.post('/ky-luat', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        let quyetDinh = req.body.quyetDinh;
        let push = {
            ...req.body,
            user: user,
            quyetDinh: JSON.parse(quyetDinh),
        };
        await mongoose.model('discipline').create(push,  async (err, data) => {
            if(err) return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, 'Ok', data);
        });
    });

    router.get('/ky-luat/:discipline_id', checkPermission(constants.IS_USER), async (req, res, next) => {
        let discipline_id = req.params.discipline_id;
        let user = req.user;
        try {
            let discipline = await mongoose.model('discipline').findOne({"_id": discipline_id, "user": user._id}).exec();
            if(discipline == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", discipline)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.put('/ky-luat/:discipline_id', checkPermission(constants.IS_USER), async (req, res, next) => {
        let discipline_id = req.params.discipline_id;
        let user = req.user;
        let quyetDinh = req.body.quyetDinh;
        try {
            let update = {
                ...req.body,
                _id: discipline_id,
                user: user,
                quyetDinh: JSON.parse(quyetDinh),
            };
            await mongoose.model('discipline').findOneAndUpdate({"_id": discipline_id, "user": user._id}, {$set: update}, {new: true},(err, data) => {
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

    router.delete('/ky-luat/:discipline_id', checkPermission(constants.IS_USER), (req, res, next) => {
        let discipline_id = req.params.discipline_id;
        let user = req.user;
        try {
            mongoose.model('discipline').findOneAndDelete({"_id": discipline_id, "user": user._id}, (err, data) => {
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
