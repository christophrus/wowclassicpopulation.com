const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const Character = require('../../models/Character');
const Time = require('../../models/Time');
const parse = require('./parse');
const db = require('./db');

const RethrownError = require('../../lib/RethrownError');
const { filter } = require('./helper');

const process = {
  characterData: async parsedChars => {
    // get the current char db so we can compare it to the uploaded data
    let charDb;
    try {
      charDb = await Character.find({})
        .lean()
        .exec();
    } catch (error) {
      throw new RethrownError('Database Error', error);
    }

    // find parsed Chars that actually have changed
    const updateChars = parsedChars.filter(filter.byChangedChars(charDb));

    // add parsed chars that are new
    const newChars = parsedChars.filter(filter.byNewChars(charDb));

    return { updateChars, newChars };
  },
  timesData: async parsedTimes => {
    // get the current time db so we can compare it to the uploaded data
    let timeDb;
    try {
      timeDb = await Time.find({})
        .lean()
        .exec();
    } catch (error) {
      throw new RethrownError('Database Error', error);
    }

    const newTimes = parsedTimes.filter(filter.byNewTimes(timeDb));

    return newTimes;
  }
};

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

  // process the parsed data and find out what data is new or needs to be updated
  let newTimes;
  let updateChars;
  let newChars;
  try {
    newTimes = await process.timesData(parsedTimes);
    ({ updateChars, newChars } = await process.characterData(parsedCharacters));
  } catch (error) {
    cb({ status: 500, message: 'Unexpected data processing error', trace: error });
  }

  // write processed data to db and get stats about what happened
  let timeStats;
  let charStats;
  try {
    timeStats = await db.writeTimes(parsedTimes, newTimes);
    charStats = await db.writeCharacters(parsedCharacters, newChars, updateChars);
  } catch (error) {
    cb({ status: 500, message: 'Database writing error', trace: error });
  }

  return cb(null, { charStats, timeStats });
};

module.exports = {
  censusData
};
