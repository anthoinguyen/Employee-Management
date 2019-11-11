var mongoose = require('mongoose');
var _ = require("lodash");
let returnToUser = require('../../services/returnToUsers');
let {checkPermission} = require('../../services/checkPermission');
let constants = require('../../routes/constants');

module.exports = router => {

    router.get('/giai-phap-sang-kien', checkPermission(constants.IS_USER),async (req, res, next) => {
        let user = req.user;
        try {
            let solutions = await mongoose.model('solution').find({"user": user._id}).exec();
            if(solutions == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", solutions)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.post('/giai-phap-sang-kien', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        let push = {
            ...req.body,
            user: user,
        };
        await mongoose.model('solution').create(push,  async (err, data) => {
            if(err) return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, 'Ok', data);
        });
    });

    router.get('/giai-phap-sang-kien/:solution_id', checkPermission(constants.IS_USER), async (req, res, next) => {
        let solution_id = req.params.solution_id;
        let user = req.user;
        try {
            let solution = await mongoose.model('solution').findOne({"_id": solution_id, "user": user._id}).exec();
            if(solution == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", solution)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.put('/giai-phap-sang-kien/:solution_id', checkPermission(constants.IS_USER), async (req, res, next) => {
        let solution_id = req.params.solution_id;
        let user = req.user;
        try {
            let update = {
                ...req.body,
                _id: solution_id,
                user: user,
            };
            await mongoose.model('solution').findOneAndUpdate({"_id": solution_id, "user": user._id}, {$set: update}, {new: true},(err, data) => {
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

    router.delete('/giai-phap-sang-kien/:solution_id', checkPermission(constants.IS_USER), (req, res, next) => {
        let solution_id = req.params.solution_id;
        let user = req.user;
        try {
            mongoose.model('solution').findOneAndDelete({"_id": solution_id, "user": user._id}, (err, data) => {
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
