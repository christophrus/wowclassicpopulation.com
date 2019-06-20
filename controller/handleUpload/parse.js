const { sort, filter } = require('./helper');
// traverse through character lua table and make a flat array out of it
const charactersData = censusDb => {
  let flatCharArray = [];
  Object.entries(censusDb.Servers).forEach(([realm, realmData]) => {
    Object.entries(realmData).forEach(([faction, factionData]) => {
      Object.entries(factionData).forEach(([race, raceData]) => {
        Object.entries(raceData).forEach(([wclass, wclassData]) => {
          Object.entries(wclassData).forEach(([char, charData]) => {
            const [level, guild, , lastSeen] = charData;
            const insertChar = {
              name: char,
              realm,
              faction,
              race,
              class: wclass,
              guild,
              level,
              lastSeen
            };
            flatCharArray.push(insertChar);
          });
        });
      });
    });
  });

  /* filter out duplicate characters that might be in original lua table
  /* because a player deleted its character and recreated it with a different race/class */
  flatCharArray = flatCharArray.sort(sort.byCharLastSeenAsc).filter(filter.byDuplicateChars);
  return flatCharArray;
};

// traverse through times lua table and make a flat array out of it
const timesData = censusDb => {
  let flatTimesArray = [];
  Object.entries(censusDb.TimesPlus).forEach(([realm, realmData]) => {
    Object.entries(realmData).forEach(([faction, factionData]) => {
      Object.entries(factionData).forEach(([time, timeValue]) => {
        const [
          druid,
          hunter,
          mage,
          priest,
          rogue,
          warlock,
          warrior,
          shaman,
          paladin
        ] = timeValue.split('&');
        const onlineByClass = {
          druid,
          hunter,
          mage,
          priest,
          rogue,
          warlock,
          warrior,
          shaman,
          paladin
        };
        const onlineTotal = timeValue.split('&').reduce((acc, current) => acc + Number(current), 0);
        const date = new Date(`${time.replace('&', ' ')} UTC`);
        flatTimesArray.push({
          date,
          realm,
          faction,
          onlineByClass,
          onlineTotal
        });
      });
    });
  });

  flatTimesArray = flatTimesArray.sort(sort.byDateAsc);
  return flatTimesArray;
};

module.exports = {
  charactersData,
  timesData
};
