module.exports = router => {
  require('./create')(router);
  require('./get')(router);
  require('./readNotify')(router);
}