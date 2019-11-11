module.exports = router => {
  require('./find')(router);
  require('./create')(router);
  require('./edit')(router);
  require('./delete')(router);
}