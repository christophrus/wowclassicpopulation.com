/* eslint-disable no-prototype-builtins */
const Time = require('../../models/Time');
const { makeFactionStats } = require('./process');

module.exports = (req, cb) => {
  const query = { ...req.query };

  // fix the query and replace minLevel/maxLevel with level
  if (query.hasOwnProperty('dateFrom')) {
    query.date = { $gte: new Date(query.dateFrom) };
    delete query.dateFrom;
  }
  if (query.hasOwnProperty('dateTo')) {
    if (query.hasOwnProperty('date')) {
      query.date.$lte = new Date(query.dateTo);
    } else {
      query.date = { $lte: new Date(query.dateTo) };
    }
    delete query.dateTo;
  }

  Time.find(query)
    .lean()
    .exec((error, data) => {
      if (error) return cb({ status: 500, message: 'Database Error', trace: error });
      if (data) {
        const ret = makeFactionStats(data);
        return cb(null, ret);
      }
      return cb({ status: 400, message: 'Bad request', trace: error });
    });
};
