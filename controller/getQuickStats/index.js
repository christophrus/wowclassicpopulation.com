/* eslint-disable no-prototype-builtins */
const Character = require('../../models/Character');

module.exports = (req, cb) => {
  const query = { ...req.query };

  // fix the query and replace minLevel/maxLevel with level
  if (query.hasOwnProperty('minLevel')) {
    query.level = { $gte: Number(query.minLevel) };
    delete query.minLevel;
  }
  if (query.hasOwnProperty('maxLevel')) {
    if (query.hasOwnProperty('level')) {
      query.level.$lte = Number(query.maxLevel);
    } else {
      query.level = { $lte: Number(query.maxLevel) };
    }
    delete query.maxLevel;
  }

  // remove from query if property value is all or both
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(query)) {
    if (['all', 'both'].includes(String(query[key]).toLowerCase())) {
      delete query[key];
    }
  }

  Character.aggregate(
    [
      { $match: query },
      {
        $facet: {
          _total: [{ $group: { _id: null, count: { $sum: 1 } } }],
          _realms: [
            { $group: { _id: '$realm', _count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: '$_count' } }
          ],
          _factions: [
            { $group: { _id: '$faction', _count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: '$_count' } }
          ],
          _races: [
            { $group: { _id: '$race', _count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: '$_count' } }
          ],
          _classes: [
            { $group: { _id: '$class', _count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: '$_count' } }
          ],
          _levels: [
            { $group: { _id: '$level', _count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: '$_count' } },
            { $sort: { name: 1 } }
          ],
          _guilds: [
            { $group: { _id: '$guild', _count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: '$_count' } },
            { $sort: { count: -1 } }
          ]
        }
      },
      {
        $project: {
          total: { $arrayElemAt: ['$_total.count', 0] },
          realms: '$_realms',
          factions: '$_factions',
          races: '$_races',
          classes: '$_classes',
          levels: '$_levels',
          guilds: '$_guilds'
        }
      }
    ],
    (error, data) => {
      if (error) return cb({ status: 500, message: 'Database Error', trace: error });
      if (data && data.length > 0) {
        return cb(null, data[0]);
      }
      return undefined;
    }
  );
};
