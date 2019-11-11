module.exports = app => {
  app.use('/', require('./home')),
  app.use('/thong-tin-ca-nhan', require('./employee-information')),
  app.use('/bao-cao', require('./report-statistic')),
  app.use('/tin-tuc', require('./news')),
  app.use('/quan-ly', require('./manager')),
  app.use('/giay-to', require('./documents')),
  app.use('/users', require('./users')),
  app.use('/setup', require('./setup'))
  app.use('/he-thong', require('./system'))
}