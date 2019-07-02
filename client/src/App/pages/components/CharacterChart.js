/* eslint-disable prefer-destructuring */
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './CharacterChart.css';
import BarChart from './BarChart';

const CharacterChart = props => {
  const { realmOptions, characterStats, query } = props;
  let realmLabel = 'All realms';
  let factionLabel = '';
  let raceLabel = '';
  let classLabel = '';
  let levelLabel = '';
  let factionChart = (
    <BarChart
      id="faction-chart"
      data={characterStats}
      selector="factions"
      barWidth="30"
      chartHeight="150"
      iconSize="30"
    />
  );
  let raceChart = (
    <BarChart
      id="race-chart"
      data={characterStats}
      selector="races"
      barWidth="30"
      chartHeight="150"
      iconSize="30"
    />
  );
  let classChart = (
    <BarChart
      id="class-chart"
      data={characterStats}
      selector="classes"
      barWidth="30"
      chartHeight="150"
      iconSize="30"
    />
  );
  let levelChart = (
    <BarChart
      id="level-chart"
      data={characterStats}
      selector="levels"
      hideIcons
      hideText
      scale="pow"
      gap="1"
      showXAxis
      maxWidth="340"
      chartHeight="150"
    />
  );

  const { realms, factions, races, classes, levels } = characterStats;

  if (realms.length === 1) {
    realmLabel = realms[0].name.match(/_(.*)/)[1];
  } else if (realmOptions && realms.length < realmOptions.length) {
    realmLabel = realms.map(realm => realm.name.match(/_(.*)/)[1]).join(', ');
  }
  if (factions.length === 1) {
    factionLabel = factions[0].name;
    factionChart = '';
  }
  if (races.length === 1) {
    raceLabel = races[0].name;
    raceChart = '';
  }
  if (classes.length === 1) {
    classLabel = classes[0].name;
    classChart = '';
  }
  if (levels.length === 1) {
    levelLabel = `(Level ${levels[0].name})`;
    levelChart = '';
  } else {
    const min = Math.min(...levels.map(o => Number(o.name)));
    const max = Math.max(...levels.map(o => Number(o.name)));
    levelLabel = `(${min}-${max})`;
  }

  const headLine = <h2>{realmLabel}</h2>;
  let subHeadline = `${[factionLabel, raceLabel, classLabel]
    .filter(e => e !== '')
    .join(' - ')} ${levelLabel}`;
  subHeadline = <h3>{subHeadline}</h3>;

  let realmAndFaction;
  if (query && query.realm && query.faction) {
    realmAndFaction = (
      <span>
        on
        <strong>
          &nbsp;{query.realm} ({query.faction})
        </strong>
      </span>
    );
  }

  let warning;
  if (
    query &&
    Object.prototype.hasOwnProperty.call(query, 'realm') &&
    Array.isArray(query.realm) &&
    query.realm.indexOf('Classic Beta PvP') !== -1 &&
    !Object.prototype.hasOwnProperty.call(query, 'faction') &&
    (!Object.prototype.hasOwnProperty.call(query, 'minLevel') || query.minLevel < 30)
  ) {
    warning = (
      <div>
        <FontAwesomeIcon
          style={{ marginTop: '10px', color: 'yellow' }}
          size="3x"
          icon={faExclamationTriangle}
        />
        <p style={{ fontSize: '12px' }}>
          Your current filter selection doesn&apos;t produce very meaningful results because at this
          point there is not all data from PvP horde collected. (Ally started end May and horde just
          some days ago) <br />
          <br /> If you wanna see more meaningful results, you should set a filter for a specific
          faction or at least a min level of 30 (better 40) when you really wanna see both factions
          at once.
        </p>
      </div>
    );
  }
  return (
    <div className="character-chart">
      {characterStats.realms.length === 0 ? (
        <div className="box-wrapper normal">
          <p>No data found for this selection</p>
          <h2 className="highlight">Your help is wanted!</h2>
          <p>
            If you&apos;re playing World of Warcraft: Classic {realmAndFaction} you could start
            collecting data and upload it to our database
          </p>
          <p>
            Look at the <Link to="./contribute">Instructions</Link> if you need help getting it
            started.
          </p>
        </div>
      ) : (
        <div>
          {headLine}
          {subHeadline}
          <p>Total characters recorded: {characterStats.total}</p>
          {warning}
          <div className="chart-container character box-wrapper">
            {factionChart}
            {raceChart}
            {classChart}
            {levelChart}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterChart;
