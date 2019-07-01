/* eslint-disable no-restricted-properties */
// filter methods
const { StringHash } = require('./helper');

const byDuplicateChars = (element, index, array) => {
  const foundIndex = array.findIndex(
    find => find.name === element.name && find.realm === element.realm
  );
  return foundIndex === index;
};

// sort methods
const byCharLastSeenAsc = (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen);
const byDateAsc = (a, b) => a.date - b.date;

// traverse through character lua table and make a flat array out of it
const charactersData = censusDb => {
  let flatCharArray = [];
  Object.entries(censusDb.Servers).forEach(([realm, realmData]) => {
    Object.entries(realmData).forEach(([faction, factionData]) => {
      Object.entries(factionData).forEach(([race, raceData]) => {
        Object.entries(raceData).forEach(([wclass, wclassData]) => {
          Object.entries(wclassData).forEach(([char, charData]) => {
            const [level, guild, , lastSeen, hash, sex] = charData;
            const insertChar = {
              name: char,
              realm,
              faction,
              race,
              class: wclass,
              guild,
              level,
              sex,
              lastSeen: new Date(lastSeen)
            };
            flatCharArray.push(insertChar);
            if (hash) {
              if (
                hash ===
                StringHash(realm + faction + race + wclass + char + level + guild + lastSeen + sex)
              ) {
                // console.log(char, true);
              } else {
                // console.log(char, false);
              }
            }
          });
        });
      });
    });
  });

  /* filter out duplicate characters that might be in original lua table
  /* because a player deleted its character and recreated it with a different race/class */
  flatCharArray = flatCharArray.sort(byCharLastSeenAsc).filter(byDuplicateChars);
  return flatCharArray;
};

// traverse through times lua table and make a flat array out of it
const timesData = censusDb => {
  let flatTimesArray = [];
  Object.entries(censusDb.TimesPlus).forEach(([realm, realmData]) => {
    Object.entries(realmData).forEach(([faction, factionData]) => {
      Object.entries(factionData).forEach(([time, timeValue]) => {
        const [times, hash] = timeValue.split(':');

        if (hash) {
          if (Number(hash) === StringHash(times + realm + faction + time)) {
            // console.log(time, true);
          } else {
            // console.log(time, false);
          }
        }

        // eslint-disable-next-line prettier/prettier
        const [druid, hunter, mage, priest, rogue, warlock, warrior, shaman, paladin] = times.split('&');
        // eslint-disable-next-line prettier/prettier
        const onlineByClass = { druid, hunter, mage, priest, rogue, warlock, warrior, shaman, paladin };
        const onlineTotal = times.split('&').reduce((acc, current) => acc + Number(current), 0);
        const date = new Date(`${time.replace('&', ' ')} UTC`);
        flatTimesArray.push({ date, realm, faction, onlineByClass, onlineTotal });
      });
    });
  });

  flatTimesArray = flatTimesArray.sort(byDateAsc);
  return flatTimesArray;
};

module.exports = {
  charactersData,
  timesData
};
