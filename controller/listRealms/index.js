const Time = require('../../models/Time');

module.exports = cb => {
  Time.aggregate([{ $group: { _id: '$realm', sum: { $sum: 1 } } }], (error, data) => {
    if (error) return cb({ status: 500, message: 'Database error', trace: error });
    if (data) {
      // eslint-disable-next-line no-underscore-dangle
      const realms = data.map(element => element._id).sort((a, b) => a.localeCompare(b));
      return cb(null, { realms });
    }
    return cb({ status: 500, message: 'No realms found' });
  });
};
