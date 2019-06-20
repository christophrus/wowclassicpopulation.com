import React from 'react';
import { Link } from 'react-router-dom';
import BarChart from './BarChart';
import './CharacterChart.css';

const CharacterChart = props => {
  const { characterStats, query } = props;
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
    realmLabel = realms[0].name;
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

  return (
    <div className="character-chart">
      {characterStats.realms.length === 0 ? (
        <div className="box-wrapper normal">
          <p>No data found for this selection</p>
          <h2 className="highlight">We need your help!</h2>
          <p>
            If you&apos;re playing World of Warcraft: Classic {realmAndFaction} you could start
            gathering data and upload it to our database
          </p>
          <p>
            Look at the <Link to="./submit">Instructions</Link> if you need help getting it started.
          </p>
        </div>
      ) : (
        <div>
          {headLine}
          {subHeadline}
          <p>Total characters found: {characterStats.total}</p>
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
