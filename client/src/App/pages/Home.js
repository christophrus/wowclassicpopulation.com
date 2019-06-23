import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
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
        Gathers census data from World of Warcraft: Classic realms (currently beta &amp; stress
        tests) with the help of an ingame addon and visualizes it in some fancy, filterable charts.
      </p>
      <div className="box-wrapper normal">
        {FactionPieChart}
        <h2 className="highlight">Help from the community needed!</h2>
        <p>
          This project is highly dependant on community participation, because the statistics are
          only as good as of how many people have the{' '}
          <a
            href="https://github.com/christophrus/CensusPlusClassic/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            CensusPlusClassic addon
          </a>{' '}
          installed and submit their gathered data to the website. If you wanna participate in
          improving the significance of the samples, just start gathering data while you&apos;re
          playing.
          <br />
          <br />
        </p>
        <p>
          If you need help setting it up take a look at the{' '}
          <Link to="./contribute">Instructions page</Link>. Some convenient options like an
          automatic data uploader are in the making also.
        </p>
      </div>
      <div className="discord-cta">
        <a href="https://discord.gg/MYPWGkv" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon size="7x" icon={faDiscord} />
          <p>
            Join the <br /> project <br /> discord
          </p>
        </a>
      </div>
    </div>
  );
};

export default Home;
