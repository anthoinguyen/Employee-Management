var ejs = require("ejs");
var sendEmail = require("../../services/sendEmail");
var { domain } = require('../../config')
module.exports = {
  sendNews: (title, content, attached, email) => {
    ejs.renderFile(__dirname + "/hero.ejs", {
      title,
      content,
      attached,
      domain
    }, (err, html) => {
      console.log(html)
      if (err) console.log(err);
      email.map(item => {
        let subject = title
        sendEmail.Send(item.trim(), subject, html);
      });
    });
  }
};
