var mongoose = require('mongoose');
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var moment = require('moment');

module.exports = router =>{
    router.get('/thong-tin-thay-doi', checkPermission(constants.IS_ADMIN),(req, res, next) => {
        mongoose.model('profilesWaiting').find({}).populate('user', constants.USER_POPULATE).exec((err, data) => {
            if (err)
                return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, '', data);
        })
    });

    router.get('/thong-tin-thay-doi/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let id = req.params.id;
        try {
            let waiting = await mongoose.model('profilesWaiting').findById(id).populate('user').exec();
            if(waiting == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy thông tin!');
            } else {
                return returnToUser.success(res, "Thành công!", waiting)
            }
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.delete('/thong-tin-thay-doi/:id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        let id = req.params.id;
        try {
            mongoose.model('profilesWaiting').findOneAndDelete({"_id": id}, (err, data) => {
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
    });

    router.put('/thong-tin-thay-doi/:id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        let id = req.params.id;
        mongoose.model('profilesWaiting').findById(id, '-newProfiles._id', (err, data)=>{
            if(err) return returnToUser.errorProcess(res, err);
            else if(data == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy dữ liệu cần thay đổi!');
            }
            else
            {
                mongoose.model('users').findByIdAndUpdate(data.user, {"$set": data.newProfiles}, (err, result) => {
                    if(err) throw err;
                    else if(result == null) {
                        return returnToUser.errorWithMess(res, 'Không tìm thấy người dùng để cập nhật!');
                    }
                    else
                    {
                        mongoose.model('profilesWaiting').findByIdAndRemove(id, (err, result) => {
                            return returnToUser.successWithNoData(res, 'Đã cập nhật thông tin tạm vào thông tin gốc');
                        });
                    }
                });
            }
        });
    })
};