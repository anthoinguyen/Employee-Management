var mongoose = require('mongoose');
let returnToUser = require('../../../services/returnToUsers');
let { checkPermission } = require('../../../services/checkPermission');
let constants = require('../../../routes/constants');

module.exports = router =>{
    router.get('/tim-kiem-ho-so', checkPermission(constants.IS_ADMIN), (req, res, next) => {
        let q = req.query
        let rep = ".*"+q.name+".*"
        let query = {
            'name':  {$regex: rep, $options: 'si'},
            'gender': q.gender,
            'birthday': q.birthday,
            'placeBirth': q.placeBirth,
            'IDCard': q.IDCard,
            'salaryLevel': q.salaryLevel,
        }
        mongoose.model('users').find(query).exec((err, data) => {
            if (err)
                return returnToUser.errorProcess(res, err);
            return returnToUser.success(res, 'ok', data);
        })
    });
};