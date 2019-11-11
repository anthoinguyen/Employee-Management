var mongoose = require('mongoose');
var { returnToUsers } = require('../../services');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../constants');
const { check, validationResult } = require("express-validator/check");
var uploadFile = require("../../services/uploadFile");
var config = require('../../config');
var slugify = require('slugify');
var _ = require('lodash');
var { sendNews } = require('./sendMail');

module.exports = router => {
  router.get('/', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    let news = await mongoose.model('news').find().sort({ createdDate: 1 }).populate('postedBy');
    return res.render('news', { news, roles: req.user.roles });
  });

  router.get('/news-category', async (req, res, next) => {
    try {
      let newsCategory = await mongoose.model('newsCategory').find();
      return returnToUsers.success(res, "Done", newsCategory)
    } catch (err) {
      return returnToUsers.errorProcess(res, err);
    }
  })

  router.get('/list', checkPermission(constants.IS_USER), async (req, res, next) => {
    let query = {
      createdDate: {
        $lte: new Date()
      }
    }
    let news = await mongoose.model('news').find(query).sort({ createdDate: -1 }).limit(7);
    return returnToUsers.success(res, "Done", news)
  });

  let checkInput = [
    check('title').not().isEmpty(),
    check('description').not().isEmpty(),
  ]
  router.post('/', [checkPermission(constants.IS_ADMIN) , checkInput, uploadFile.uploadDocsFile().any()], async (req, res, next) => {
    if (!_.isEmpty(req.files)) {
      req.files[0].link = req.files[0].destination.substring(6, req.files[0].destination.length) + req.files[0].filename;
    }
    let errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }
    let insert = {
      ...req.body,
      slug: slugify(req.body.title),
      postedBy: req.user._id,
      attached: !_.isEmpty(req.files) ? `${config.domain}${req.files[0].link}` : null,
    }
    let news = await mongoose.model('news').create(insert);

    if (_.isEmpty(req.body.yearId) == false && _.isEmpty(req.body.categoryId) == false) {
      let update = {
        $push: {
          'category.$[categoryId].news': {
            id: news._id,
            title: news.title
          }
        }
      }
      let option = {arrayFilters: [{
        "categoryId._id": mongoose.Types.ObjectId(`${req.body.categoryId}`)
      }], multi: false, new: true }
      await mongoose.model('newsCategory').findByIdAndUpdate(req.body.yearId, update, option);
    }
    if (req.body.email) {
      let list = req.body.email.split(';');
      sendNews(news.title, news.description, news.attached, list)
    }
    return res.redirect('/tin-tuc')
  })
}