const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const luaToJson = require('lua-to-json');
const process = require('./process');

module.exports = (uploadPath, cb) => {
  let data;

  // read uploaded file
  try {
    data = fs.readFileSync(uploadPath, { encoding: 'UTF-8' });
  } catch (error) {
    return cb({ status: 500, message: 'Internal file system error', trace: error });
  }

  // write backup to fs
  const filename = +new Date();
  const jsonPath = path.join('/storage/', `${filename}.zip`);
  const zip = new JSZip();
  zip.file(`${filename}.lua`, data);
  zip
    .generateNodeStream({
      type: 'nodebuffer',
      streamFiles: true,
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    })
    .pipe(fs.createWriteStream(jsonPath));

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
