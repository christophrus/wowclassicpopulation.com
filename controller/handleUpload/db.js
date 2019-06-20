const RethrownError = require('../../lib/RethrownError');
const Character = require('../../models/Character');
const Time = require('../../models/Time');

const makeCharUpdatePromises = (chars) => {
  const updatePromises = [];
  chars.forEach((insertChar) => {
    updatePromises.push(
      new Promise((resolve, reject) => {
        Character.findOneAndUpdate(
          { name: insertChar.name, realm: insertChar.realm },
          insertChar,
          { upsert: true, new: false, rawResult: true },
          (err, data) => {
            if (err) reject(new RethrownError('Database error - Update Operation failed', err));
            if (data) {
              resolve('updated');
            } else {
              resolve('skipped');
            }
          },
        );
      }),
    );
  });
  return updatePromises;
};

const writeTimes = async (parsedTimes, newTimes) => {
  const timeStats = {
    skipped: 0,
    inserted: 0,
  };

  const insertedTimes = await Time.insertMany(newTimes);
  timeStats.inserted = insertedTimes.length;

  timeStats.skipped = parsedTimes.length - timeStats.inserted;

  return timeStats;
};

const writeCharacters = async (parsedChars, newChars, updateChars) => {
  // merge updated and new chars together
  const charStats = {
    skipped: 0,
    inserted: 0,
    updated: 0,
  };

  const insertedDocs = await Character.insertMany(newChars);
  charStats.inserted = insertedDocs.length;

  const updateResults = await Promise.all(makeCharUpdatePromises(updateChars));
  updateResults.forEach((updateResult) => {
    charStats[updateResult] += 1;
  });

  charStats.skipped += parsedChars.length - charStats.inserted - charStats.updated;

  return charStats;
};

module.exports = {
  writeTimes,
  writeCharacters,
};
