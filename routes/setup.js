var router = require('express').Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var constants = require('./constants');
var _ = require('lodash');
var moment = require('moment');

router.get('/', (req, res, next) => {
  bcrypt.hash('123', 10, async (err, passHash) => {
    let user = {
      name: "Admin",
      email: 'admin@gmail.com',
      password: passHash,
      roles: constants.IS_ADMIN,
      usersCardNumber: "123",
      birthday: moment().utc(7).set('month', moment().utc(7).get('month') + 1),
      cuuNhanVien: "0"
    }
    let users = await mongoose.model('users').create(user);

    let user1 = {
      name: "users",
      email: 'users@gmail.com',
      password: passHash,
      roles: constants.IS_USER,
      birthday: moment().utc(7).set('month', moment().utc(7).get('month') + 1),
      cuuNhanVien: "0"
    }
    let users1 = await mongoose.model('users').create(user1);

    let contract = {
      usersId: users._id,
      name: users.name,
      usersCardNumber: _.get(users, 'usersCardNumber'),
      typeOfUsers: _.get(users, 'typeOfUsers')
    };

    let contracts = await mongoose.model('contract').create(contract)
    mongoose.model('typeOfDocuments').create({ name: "Giấy tờ mẫu "})

    let settings = {
          luongCoBan: 1000000
      };
    mongoose.model('settings').create(settings);

    return res.send(users)
  })
})

module.exports = router;