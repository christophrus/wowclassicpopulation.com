const selectMapper = data => {
  return data.map(element => ({
    value: String(element)
      .toLowerCase()
      .replace(/\s/g, '_'),
    label: element
  }));
};

export default function getRealmList(cb) {
  window
    .fetch(`api/list/realms`)
    .then(res => res.json())
    .then(realmList => {
      const realms = selectMapper(realmList.realms);
      cb(realms);
    });
}
