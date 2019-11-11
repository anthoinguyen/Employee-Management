var router = require('express').Router();

require("./report/index")(router);
require("./statistic/index")(router);

module.exports = router;