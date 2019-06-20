// filter methods
const byChangedChars = dbChars => el =>
  dbChars.findIndex(
    find =>
      find.name === el.name &&
      find.realm === el.realm &&
      (find.guild !== el.guild ||
        find.race !== el.race ||
        find.class !== el.class ||
        find.level !== el.level ||
        find.lastSeen < new Date(el.lastSeen))
  ) !== -1;

const byNewChars = charDb => el =>
  charDb.findIndex(find => find.name === el.name && find.realm === el.realm) === -1;

const byNewTimes = timeDb => el =>
  timeDb.findIndex(find => find.date.getTime() === el.date.getTime() && find.realm === el.realm) ===
  -1;

const byDuplicateChars = (element, index, array) => {
  const foundIndex = array.findIndex(
    find => find.name === element.name && find.realm === element.realm
  );
  return foundIndex === index;
};

// sort methods
const byCharLastSeenAsc = (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen);
const byDateAsc = (a, b) => a.date - b.date;

module.exports = {
  filter: {
    byChangedChars,
    byNewChars,
    byNewTimes,
    byDuplicateChars
  },
  sort: { byCharLastSeenAsc, byDateAsc }
};
