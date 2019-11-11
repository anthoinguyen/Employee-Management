var mongoose = require('mongoose');
var { success, errorProcess } = require('../../services/returnToUsers');
var _ = require('lodash');
var { asyncForEach } = require('../../services/asyncForEach')
module.exports = router => {
  router.get('/category', async (req, res, next) => {
    try {
      let newsCategory = await mongoose.model('newsCategory').find();
      return success(res, "Done", newsCategory)
    } catch (err) {
      return errorProcess(res, err);
    }
  });

  router.post('/category', async (req, res, next) => {
    try {
      let category = JSON.parse(_.get(req.body, 'category'));
      let object = [];
      category.map(item => {
        if (!_.isEmpty(item)) {
          object.push({ title: item.trim() })
        }
      })
      let insert = {
        year: _.get(req.body, 'year', new Date().getFullYear()),
        category: object
      }
      let newsCategory = await mongoose.model('newsCategory').create(insert);
      return success(res, "Done", newsCategory)
    } catch (err) {
      return errorProcess(res, err)
    }
  })

  router.post('/category/:id', async (req, res, next) => {
    try {
      let category = JSON.parse(_.get(req.body, 'category'));
      
      let option = {
        new: true
      }
      await asyncForEach(category, async item => {
        if (!_.isEmpty(item)) {
          let update = {
            $push: {
              category: {
                title: item.trim()
              }
            }
          }
          await mongoose.model('newsCategory').findOneAndUpdate({ _id: req.params.id }, update, option)
        }
      })

      return success(res, "Done", null)
    } catch (err) {
      return errorProcess(res, err)
    }
  })

  router.delete('/category/:id', async (req, res, next) => {
    try {
      await mongoose.model('newsCategory').findOneAndDelete({ _id: req.params.id })
      return success(res, "Done", null)
    } catch (err) {
      return errorProcess(res, err)
    }
  })
}