module.exports = router => {
  require('./list')(router);
  require('./create')(router);
  require('./delete')(router);
  require('./edit')(router);
  require('./find')(router);
};
