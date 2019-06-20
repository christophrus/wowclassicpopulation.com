import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PieChart from './components/PieChart';

const Home = () => {
  const [quickStats, setQuickstats] = useState(false);

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
    FactionPieChart = (
      <PieChart id="faction-pie-chart" width="400" height="400" data={quickStats} />
    );
  }

  return (
    <div className="App">
      <h1>Census - Wow Classic Population</h1>
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
          <Link to="./submit">here</Link>.
          <br />
          <br />
        </p>
        <p>
          Do you need assistance? Just follow the data submission{' '}
          <Link to="./submit">instructions</Link> or ask in my{' '}
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
