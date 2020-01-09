module.exports = router =>{
    require('./analytics')(router);
    require('./create')(router);
    require('./list')(router);
    require('./delete')(router);
    require('./export')(router);
}