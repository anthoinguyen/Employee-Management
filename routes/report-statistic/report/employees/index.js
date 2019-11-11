module.exports = router => {
    require('./quality')(router);
    require('./position')(router);
    require('./seniority')(router);
    require('./salary')(router);
}