var router = require('express').Router();

require('./listCategory')(router);
require('./category')(router);
require('./listAndCreate')(router);
require('./edit')(router);
require('./delete')(router);
require('./get')(router);

module.exports = router;