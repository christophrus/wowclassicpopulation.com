import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PieChart from './components/PieChart';
import useWindowDimensions from './hooks/useWindowDimensions';

const Home = () => {
  const [quickStats, setQuickstats] = useState(false);
  const { height, width } = useWindowDimensions();

  const getQuickStats = () => {
    window
      .fetch(`/api/stats/quick`)
      .then(res => res.json())
      .then(stats => {
        setQuickstats(stats);
      });
  };

  useEffect(() => {
    if (!quickStats) {
      getQuickStats();
    }
  });

  let FactionPieChart = <div>Baking a pie ...</div>;
  if (quickStats) {
    let pieDimensions = 400;
    if (width < 500) {
      pieDimensions = width * 0.8;
    }
    FactionPieChart = (
      <PieChart
        id="faction-pie-chart"
        width={pieDimensions}
        height={pieDimensions}
        data={quickStats}
      />
    );
  }

  return (
    <div className="App">
      <h1>Wow Classic Population - A census project</h1>
      <p className="subtitle">
        This project gathers census data from World of Warcraft: Classic realms (currently from beta
        &amp; stress tests) with the help of an ingame addon and visualizes it in some fancy,
        filterable charts.
      </p>
      <div className="box-wrapper normal">
        {FactionPieChart}
        <h2 className="highlight">I need your help!</h2>
        <p>
          Are you interessted in growing and completing the database? Install the{' '}
          <a
            href="https://github.com/christophrus/CensusPlusClassic/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            CensusPlusClassic Addon
          </a>
          , start gathering data while you&apos;re playing and submit it to the database{' '}
          <Link to="./contribute">here</Link>.
          <br />
          <br />
        </p>
        <p>
          Do you need assistance? Just follow the data submission{' '}
          <Link to="./contribute">instructions</Link> or ask in my{' '}
          <a href="https://www.reddit.com/c30vdp" target="_blank" rel="noopener noreferrer">
            reddit thread
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Home;
