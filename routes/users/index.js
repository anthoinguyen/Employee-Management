var router = require('express').Router();

require('./login')(router);
require('./logout')(router);
require('./roles')(router);
require('./changePassword')(router);

module.exports = router;