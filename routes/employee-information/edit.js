var mongoose = require('mongoose');
var _ = require("lodash");
var uploadFile = require("../../services/uploadFile");
let returnToUser = require('../../services/returnToUsers');
let {checkPermission} = require('../../services/checkPermission');
let constants = require('../../routes/constants');
var moment = require('moment');

module.exports = router => {
    router.get('/chinh-sua', checkPermission(constants.IS_USER), async (req, res, next) => {
        let user = req.user;
        try {
            let waiting = await mongoose.model('profilesWaiting').findOne({"user": user._id}).exec();
            if(waiting == null)
                res.render('employee-information/edit.ejs', { user: user, roles: req.user.roles });
            res.render('employee-information/exists.ejs', { user: waiting.newProfiles, roles: req.user.roles });
        } catch (err) {
            return returnToUser.errorProcess(res, err);
        }

    });

    router.put('/chinh-sua', checkPermission(constants.IS_USER), async (req, res, next) =>{
        let user = req.user;
        let newProfiles = JSON.parse(req.body.newProfiles);
        let data = {
            'user': user._id,
            'newProfiles': newProfiles
        };
        mongoose.model('profilesWaiting').create(data, (err, result) => {
            if (err) return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, 'Ok', result);
        });
    });

    router.put('/hinh-anh', [checkPermission(constants.IS_USER), uploadFile.uploadImgUser().single('userImg')], async (req, res, next) => {
        let userImage = '';
        let user = req.user;
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
    });
};
