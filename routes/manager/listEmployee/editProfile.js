var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
let returnToUser = require('../../../services/returnToUsers');
var uploadFile = require("../../../services/uploadFile");
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');
var bcrypt = require('bcryptjs');
var moment = require('moment');

module.exports = router =>{
    router.get('/chinh-sua-ho-so/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let id = req.params.id;
        try {
            let user = await mongoose.model('users').findById(id).exec();
            if(user == null) {
                res.render('manager/listEmployee/editProfile.ejs', {data: null,roles: req.user.roles});
            } else {
                res.render('manager/listEmployee/editProfile.ejs', {data: user,roles: req.user.roles})
            }
        } catch(err) {
            return returnToUser.errorProcess(res, err);
        }
    });

    router.put('/chinh-sua-ho-so/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
        let id = req.params.id;
        let update = {
            ...req.body,
            _id: id,
            placeBirth: JSON.parse(req.body.placeBirth),
            hometown: JSON.parse(req.body.hometown),
            educationLevel: JSON.parse(req.body.educationLevel),
            communist: JSON.parse(req.body.communist),
            ngayThamGiaToChucCTXH: JSON.parse(req.body.ngayThamGiaToChucCTXH),
            army: JSON.parse(req.body.army),
            // award: JSON.parse(req.body.award),
            // discipline: JSON.parse(req.body.discipline),
            health: JSON.parse(req.body.health),
            veterans: JSON.parse(req.body.veterans),
            IDCard: JSON.parse(req.body.IDCard),
            // course: JSON.parse(req.body.course),
            youthUnion: JSON.parse(req.body.youthUnion),
            workingProccess: JSON.parse(req.body.workingProccess),
            personalHistory: JSON.parse(req.body.personalHistory),
            familyRelationship: JSON.parse(req.body.familyRelationship),
            wageMovements: JSON.parse(req.body.wageMovements),
            // laborContract: JSON.parse(req.body.laborContract),
            // belongToDepartment: JSON.parse(req.body.belongToDepartment),
        };
        try {
            let user = await mongoose.model('users').findById(id).exec();
            if (user == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy user!');
            } else {
                if(req.body.email && req.body.email !== user.email) {
                    let another_user = await mongoose.model('users').findOne({"email": req.body.email}).exec();
                    if(another_user !== null) {
                        if(user._id !== another_user._id) {
                            return returnToUser.errorWithMess(res, 'Email '+req.body.email+' đã có người sử dụng!');
                        }
                    }
                }
                let user_save = await mongoose.model('users').findByIdAndUpdate(id, {$set: update},  {new: true}).exec();
                return returnToUser.success(res, 'Đã lưu thông tin mới', user_save);
            }
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });
    router.put('/chinh-sua-hinh-anh/:user_id', [checkPermission(constants.IS_ADMIN), uploadFile.uploadImgUser().single('userImg')], async (req, res, next) => {
        let userImage = '';
        let id = req.params.user_id;
        try {
            let user = await mongoose.model('users').findById(id).exec();
            if (user == null) {
                return returnToUser.errorWithMess(res, 'Không tìm thấy user!');
            } else {
                if(req.file) {
                    const path = req.file.destination.substring(6) + '/' + req.file.filename;
                    const update = {
                        _id: user._id,
                        userImage: path,
                    };
                    let user_save = await mongoose.model('users').findOneAndUpdate({_id: user._id}, {$set: update},  {new: true}).exec();
                    return returnToUser.success(res, 'Đã upload hình ảnh thành công!', user_save);
                } else {
                    return returnToUser.errorWithMess(res, 'Không thể upload hình ảnh, vui lòng kiểm tra lại!')
                }
            }
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }
    });
}