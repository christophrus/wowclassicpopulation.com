import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import './index.css';
import './sliderRailFix.css';

import {
  getFactions,
  getClasses,
  getClassesByRace,
  getClassesByFaction,
  getRaces,
  getRacesByFaction
} from './WowHelper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  slider: {
    width: 300,
    color: 'rgba(0, 0, 0, 0.54)',
    '&:hover': {
      thumb: 'box-shadow: 0px 0px 0px 8px #000'
    }
  },
  outlinedPrimary: {
    border: '1px solid #D7CB83',
    color: '#D7CB83',
    '&:hover': {
      border: '1px solid #7A3C3C',
      color: '#7A3C3C',
      backgroundColor: 'rgba(233, 135, 70, 0.08);'
    }
  }
}));

export default function BarChartFilterForm({ realmOptions, onChange }) {
  const classes = useStyles();

  const [selectedRealm, setSelectedRealm] = React.useState([]);
  const [selectedFaction, setSelectedFaction] = React.useState('');
  const [selectedRace, setSelectedRace] = React.useState('');
  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState([1, 60]);

  const [factionOptions] = React.useState(getFactions());
  const [raceOptions, setRaceOptions] = React.useState(getRaces());
  const [classOptions, setClassOptions] = React.useState(getClasses());

  function handleRealmChange(event) {
    setSelectedRealm(event.target.value);
  }

  function handleFactionChange(event) {
    const faction = event.target.value;
    setSelectedFaction(faction);

    const races = getRacesByFaction(faction);
    const wclasses = getClassesByFaction(faction);
    // empty race selection if it isnt in the selected faction
    if (
      selectedRace !== '' &&
      races.findIndex(element => element.value === selectedRace.value) === -1
    ) {
      setSelectedRace('');
    }
    // empty class selection if it isnt in the the selected faction
    if (
      selectedClass !== '' &&
      wclasses.findIndex(element => element.value === selectedClass.value) === -1
    ) {
      setSelectedClass('');
    }
    setRaceOptions(races);
    setClassOptions(wclasses);
  }

  function handleRaceChange(event) {
    const race = event.target.value;
    setSelectedRace(race);

    const wclasses = getClassesByRace(race);

    // empty class selection if it isnt in the the selected faction
    if (
      selectedClass !== '' &&
      wclasses.findIndex(element => element.value === selectedClass.value) === -1
    ) {
      setSelectedClass('');
    }
    setClassOptions(wclasses);
  }

  function handleClassChange(event) {
    setSelectedClass(event.target.value);
  }

  function handleLevelChange(event, newValue) {
    setSelectedLevel(newValue);
  }

  function resetForm() {
    setSelectedRealm([]);
    setClassOptions(getClasses());
    setRaceOptions(getRaces());
    setSelectedFaction('');
    setSelectedRace('');
    setSelectedClass('');
    setSelectedLevel([1, 60]);
    onChange({});
  }

  function handleApplyClick() {
    const query = {};
    const [minLevel, maxLevel] = selectedLevel;
    if (selectedRealm !== []) {
      query.realm = selectedRealm.map(realm => realm.label);
    }
    if (selectedFaction !== '') {
      query.faction = selectedFaction.label;
    }
    if (selectedRace !== '') {
      query.race = selectedRace.label;
    }
    if (selectedClass !== '') {
      query.class = selectedClass.label;
    }
    if (minLevel !== 1) {
      query.minLevel = minLevel;
    }
    if (maxLevel !== 60) {
      query.maxLevel = maxLevel;
    }
    onChange(query);
  }

  function handlePreset(event) {
    const preset = event.target.name;
    if (preset === 'bothBetaRealms40Ally') {
      const pveIndex = realmOptions.findIndex(find => find.value === 'classic_beta_pve');
      const pveObj = realmOptions[pveIndex];
      const pvpIndex = realmOptions.findIndex(find => find.value === 'classic_beta_pvp');
      const pvpObj = realmOptions[pvpIndex];
      const allyIndex = factionOptions.findIndex(find => find.value === 'alliance');
      const allyObj = factionOptions[allyIndex];
      setSelectedRealm([pveObj, pvpObj]);
      handleFactionChange({ target: { value: allyObj } });
      setSelectedClass([]);
      setSelectedRace([]);
      setSelectedLevel([40, 40]);
    } else if (preset === 'pvpOnly40') {
      const pvpIndex = realmOptions.findIndex(find => find.value === 'classic_beta_pvp');
      const pvpObj = realmOptions[pvpIndex];
      setSelectedRealm([pvpObj]);
      handleFactionChange({ target: { value: '' } });
      setSelectedRace([]);
      setSelectedClass([]);
      setSelectedLevel([40, 40]);
    } else if (preset === 'pveOnly40') {
      const pveIndex = realmOptions.findIndex(find => find.value === 'classic_beta_pve');
      const pveObj = realmOptions[pveIndex];
      setSelectedRealm([pveObj]);
      handleFactionChange({ target: { value: '' } });
      setSelectedRace([]);
      setSelectedClass([]);
      setSelectedLevel([40, 40]);
    } else if (preset === 'alterac') {
      const alteracIndex = realmOptions.findIndex(find => find.value === 'field_of_strife');
      const alteracObj = realmOptions[alteracIndex];
      setSelectedRealm([alteracObj]);
      handleFactionChange({ target: { value: '' } });
      setSelectedRace([]);
      setSelectedClass([]);
      setSelectedLevel([58, 58]);
    }
  }

  return (
    <form className={classes.root} autoComplete="off">
      <div className="form-wrapper box-wrapper filter-form">
        <p>Filter presets you may find interesting</p>
        <ul>
          <li>
            <button type="button" className="list" name="pvpOnly40" onClick={handlePreset}>
              Beta PvP (both factions) - Level 40
            </button>
          </li>
          <li>
            <button type="button" className="list" name="pveOnly40" onClick={handlePreset}>
              Beta PvE (both factions) - Level 40
            </button>
          </li>
          <li>
            <button
              type="button"
              className="list"
              name="bothBetaRealms40Ally"
              onClick={handlePreset}
            >
              Both Beta realms (Alliance) - Level 40
            </button>
          </li>
          <li>
            <button type="button" className="list" name="alterac" onClick={handlePreset}>
              Alterac Valley Test - Level 58
            </button>
          </li>
        </ul>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="realm-filter">Realm</InputLabel>
            <Select
              multiple
              value={selectedRealm}
              onChange={handleRealmChange}
              inputProps={{
                name: 'realm',
                id: 'realm-filter'
              }}
            >
              {realmOptions.map(element => (
                <MenuItem key={element.value} value={element}>
                  {element.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="faction-filter">Faction</InputLabel>
            <Select
              value={selectedFaction}
              onChange={handleFactionChange}
              inputProps={{
                name: 'faction',
                id: 'faction-filter'
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {factionOptions.map(element => (
                <MenuItem key={element.value} value={element}>
                  {element.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="race-filter">Race</InputLabel>
            <Select
              value={selectedRace}
              onChange={handleRaceChange}
              inputProps={{
                name: 'race',
                id: 'race-filter'
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {raceOptions.map(element => (
                <MenuItem key={element.value} value={element}>
                  {element.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="race-filter">Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={handleClassChange}
              inputProps={{
                name: 'class',
                id: 'class-filter'
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {classOptions.map(element => (
                <MenuItem key={element.value} value={element}>
                  {element.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <Typography id="range-slider" gutterBottom>
            Level Range
          </Typography>
          <Slider
            className={classes.slider}
            value={selectedLevel}
            onChange={handleLevelChange}
            valueLabelDisplay="auto"
            classes={{ rail: 'fix-slider-rail' }}
            max={60}
            min={1}
          />
        </div>
        <div>
          <Button className={classes.button} onClick={resetForm}>
            Reset
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.outlinedPrimary}
            onClick={handleApplyClick}
          >
            Apply filter
          </Button>
        </div>
      </div>
    </form>
  );
}
