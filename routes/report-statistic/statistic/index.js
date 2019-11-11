module.exports = router => {
  require('./curiculumVitae')(router);
  require('./courses')(router);
  require('./contacts')(router);
  require('./seniority')(router);
  require('./contracts')(router);
}