var router = require('express').Router();

require("./show")(router);
require("./edit")(router);
require("./courses")(router);
require("./awards")(router);
require("./discipline")(router);
require("./solution")(router);

module.exports = router;
