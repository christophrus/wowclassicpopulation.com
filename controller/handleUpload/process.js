const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const Character = require('../../models/Character');
const Time = require('../../models/Time');
const parse = require('./parse');

// process the lua database
const censusData = async (censusDb, cb) => {
  // parse the lua structures and get a nore flattenned array
  let parsedTimes;
  let parsedCharacters;
  try {
    parsedTimes = parse.timesData(censusDb);
    parsedCharacters = parse.charactersData(censusDb);
  } catch (error) {
    cb({ status: 400, message: 'Parsing error - imvaid times/character format', trace: error });
  }

  // write backup to fs
  const jsonData = JSON.stringify({ parsedTimes, parsedCharacters }, null, 2);
  const jsonPath = path.join('/storage/', `${+new Date()}.zip`);
  const zip = new JSZip();
  zip.file('data.json', jsonData);
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

  // update db
  // first create the bulk queries
  const characterBulk = parsedCharacters.map(character => ({
    updateOne: {
      filter: { realm: character.realm, name: character.name },
      upsert: true,
      update: { ...character }
    }
  }));

  const timesBulk = parsedTimes.map(time => ({
    updateOne: {
      filter: { data: time.date, realm: time.realm, faction: time.faction },
      upsert: true,
      update: { ...time }
    }
  }));

  // second wait for both queries to finish and return stats
  Promise.all([Character.bulkWrite(characterBulk), Time.bulkWrite(timesBulk)])
    .then(([characters, times]) => {
      const stats = {
        charStats: {
          processed: parsedCharacters.length,
          inserted: characters.upsertedCount,
          updated: characters.modifiedCount
        },
        timeStats: {
          inserted: times.upsertedCount,
          updated: times.modifiedCount
        }
      };
      return cb(null, stats);
    })
    .catch(error => {
      cb({ status: 500, message: 'Processing error', trace: error });
    });
};

module.exports = {
  censusData
};
