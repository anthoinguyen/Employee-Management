var mongoose = require('mongoose');
var _ = require("lodash");
let returnToUser = require('../../services/returnToUsers');
let {checkPermission} = require('../../services/checkPermission');
let constants = require('../../routes/constants');

module.exports = router => {

    router.get('/dao-tao', checkPermission(constants.IS_USER),async (req, res, next) => {
        let user = req.user;
        try {
            let courses = await mongoose.model('courses').find({"user": user._id}).exec();
            if(courses == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", courses)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.post('/dao-tao', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        let push = {
            ...req.body,
            user: user,
        };
        await mongoose.model('courses').create(push,  async (err, data) => {
            if(err) return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, 'Ok', data);
        });
    });

    router.get('/dao-tao/:course_id', checkPermission(constants.IS_USER), async (req, res, next) => {
        let course_id = req.params.course_id;
        let user = req.user;
        try {
            let course = await mongoose.model('courses').findOne({"_id": course_id, "user": user._id}).exec();
            if(course == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy!');
            } else {
                return returnToUser.success(res, "Thành công!", course)
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.put('/dao-tao/:course_id', checkPermission(constants.IS_USER), async (req, res, next) => {
        let course_id = req.params.course_id;
        let user = req.user;
        try {
            let update = {
                ...req.body,
                _id: course_id,
                user: user,
            };
            await mongoose.model('courses').findOneAndUpdate({"_id": course_id, "user": user._id}, {$set: update}, {new: true},(err, data) => {
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

    router.delete('/dao-tao/:course_id', checkPermission(constants.IS_USER), (req, res, next) => {
        let course_id = req.params.course_id;
        let user = req.user;
        try {
            mongoose.model('courses').findOneAndDelete({"_id": course_id, "user": user._id}, (err, data) => {
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
