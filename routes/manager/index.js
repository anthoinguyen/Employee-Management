var router = require('express').Router();

require("./award-discipline/index")(router);
require("./listDepartment/index")(router);
require("./contract/index")(router);
require("./courses/index")(router);
require("./day-off/index")(router);
require("./listEmployee/index")(router);
require("./salary/index")(router);
require("./workOverTime")(router);
require("./solution-innovation")(router);

module.exports = router;
