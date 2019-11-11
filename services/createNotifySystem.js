var mongoose = require('mongoose');

module.exports = {
  createNotifySystem: (toId, title, content) => {
    return new Promise(async (resolve, reject) => {
      try {
        let insert = {
          to: toId,
          title,
          content
        }
        let notify = await mongoose.model('notifies').create(insert);
        resolve(notify);
      } catch (err) {
        reject (err);
      }
    })
  }
}