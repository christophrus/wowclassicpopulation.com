import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
    width: 300
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 150
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

export default function FilterForm({ realmOptions, onChange }) {
  const classes = useStyles();

  const [selectedRealm, setSelectedRealm] = React.useState('');
  const [selectedDateFrom, setSelectedDateFrom] = React.useState('');
  const [selectedDateTo, setSelectedDateTo] = React.useState('');

  function handleRealmChange(event) {
    setSelectedRealm(event.target.value);
  }

  function handleDateFromChange(event) {
    if (selectedDateTo !== '' && new Date(selectedDateTo) < new Date(event.target.value)) {
      setSelectedDateFrom(selectedDateTo);
      setSelectedDateTo(event.target.value);
    } else {
      setSelectedDateFrom(event.target.value);
    }
  }

  function handleDateToChange(event) {
    if (selectedDateFrom !== '' && new Date(selectedDateFrom) > new Date(event.target.value)) {
      setSelectedDateTo(selectedDateFrom);
      setSelectedDateFrom(event.target.value);
    } else {
      setSelectedDateTo(event.target.value);
    }
  }

  function handleResetClick() {
    setSelectedRealm('');
    onChange({});
  }

  function handleApplyClick() {
    const query = {};
    if (selectedRealm !== '') {
      query.realm = selectedRealm.label;
    }
    if (selectedDateFrom !== '') {
      query.dateFrom = selectedDateFrom;
    }
    if (selectedDateFrom !== '') {
      query.dateTo = selectedDateTo;
    }
    onChange(query);
  }

  return (
    <form className={classes.root} autoComplete="ON">
      <div className="form-wrapper box-wrapper">
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="realm-filter">Realm</InputLabel>
            <Select
              value={selectedRealm}
              onChange={handleRealmChange}
              inputProps={{
                name: 'realm',
                id: 'realm-filter'
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {realmOptions.map(element => (
                <MenuItem key={element.value} value={element}>
                  {element.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: 10 }}>
          <TextField
            id="dateFrom"
            label="From"
            type="date"
            value={selectedDateFrom}
            onChange={handleDateFromChange}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="dateTo"
            label="To"
            type="date"
            value={selectedDateTo}
            onChange={handleDateToChange}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>
        <div>
          <Button className={classes.button} onClick={handleResetClick}>
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
