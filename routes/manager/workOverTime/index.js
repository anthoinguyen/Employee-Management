module.exports = router => {
  require('./create')(router);
  require('./delete')(router);
  require('./list')(router);
}