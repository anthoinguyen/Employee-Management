var mongoose = require('mongoose');
var { errorProcess } = require('../../../services/returnToUsers');
var { checkPermission } = require('../../../services/checkPermission');
var constants = require('../../constants');
const { check, validationResult } = require("express-validator/check");

module.exports = router => {
  router.get('/quan-ly-chuc-vu', [checkPermission(constants.IS_ADMIN)], async (req, res, next) => {
    try {
      let positions = await mongoose.model('positions').find({});
      return res.render('system/positions', {
        positionsList: positions,
        roles: req.user.roles
      })
    } catch (err) {
      console.log(err);
    }
  })

  let checkInput = [
    check('positionId').not().isEmpty(),
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
  ]
  router.post('/quan-ly-chuc-vu', [checkPermission(constants.IS_ADMIN), checkInput], async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      let positions = await mongoose.model('positions').create({ ...req.body });
      let positionsList = await mongoose.model('positions').find();
      return res.render('system/positions', {
        positionsList
      })
    } catch (err) {
      console.log(err)
    }
  })

  checkInput = [
    check('positionId').not().isEmpty(),
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
  ]
  router.put('/quan-ly-chuc-vu/:id', [checkPermission(constants.IS_ADMIN), checkInput], async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      let positions = await mongoose.model('positions').findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true })
      let positionsList = await mongoose.model('positions').find();
      return res.render('system/positions', {
        positionsList
      })
    } catch (err) {
      console.log(err)
    }
  })

  router.delete('/quan-ly-chuc-vu/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let positions = await mongoose.model('positions').findOneAndRemove({ _id: req.params.id })
      let positionsList = await mongoose.model('positions').find();
      return res.render('system/positions', {
        positionsList
      })
    } catch (err) {
      console.log(err)
    }
  })
}