import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="App">
      <h1>Project Home</h1>
      <div className="box-wrapper normal">
        <p className="intro">
          <strong className="stroke">Start gathering data, instructions are here:</strong>
          <Link to="./upload"> CensusPlusClassic Addon</Link>
          <br />
          <br />
        </p>
        <h2>Details</h2>
        <h3>What</h3>
        <p>
          I&apos;m currently gathering character data from the classic beta and stress test realms.
          This data includes character names, realm, faction, race, class, level and guild. This
          data is funneled into an online database, so that I can generate some fancy charts out of
          it so that everyone can have a easy look on it.
        </p>
        <h3>How</h3>
        <p>
          I have forked the client 7.3.5 version of CenusPlus and fixed it to work with the beta
          client. CenusPlus is an addon that basically chains /who request in an intelligent way, so
          that it can gather as much as possible characters that are currently online on a realm.
          The addon saves all this data in a *.lua file that then can be uploaded onto this website
          to merge it with the gathered data of other people.
        </p>
        <h3>Who</h3>
        <p>
          Currently I&apos;m working alome on this project and so far I gathered all character data
          by myself, but I would really appreciate if more people would join and start gathering
          data.
        </p>
        <h3>Motivation</h3>
        <p>
          I&apos;m a junior web developer and using this project to sharpen my addon and web
          development skills.
        </p>
        <h3>When</h3>
        <p>
          The state of this website is like the one of classic wow: beta. At the moment I&apos;m
          working constantly on this project and my goal is it to bring it to improve it to
          perfection until the launch of classic wow. When you find some bugs, feel free to post
          them in my reddit post.
        </p>
      </div>
    </div>
  );
};

export default Home;
