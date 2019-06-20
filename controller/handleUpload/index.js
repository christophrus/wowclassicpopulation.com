const fs = require('fs');
const luaToJson = require('lua-to-json');
const process = require('./process');

module.exports = (path, cb) => {
  let data;

  // read uploaded file
  try {
    data = fs.readFileSync(path, { encoding: 'UTF-8' });
  } catch (error) {
    return cb({ status: 500, message: 'Internal file system error', trace: error });
  }

  // parse lua table to a json
  let censusDb;
  try {
    censusDb = luaToJson(data).CensusPlus_Database;
  } catch (error) {
    return cb({ status: 400, message: 'Parse error - Unknown file format', trace: error });
  }

  // process the uploaded data
  process.censusData(censusDb, (error, stats) => {
    if (error) return cb(error);
    if (stats) {
      return cb(null, stats);
    }
    return undefined;
  });

  return undefined;
};
