var router = require('express').Router();

require('./positions')(router)
require('./createNewYear')(router)
require('./systemSalary/')(router)
require('./systemTypeOfDocuments')(router)
require('./event')(router)
require('./settings')(router)

module.exports = router;