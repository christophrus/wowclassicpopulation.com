import React from 'react';

const About = () => {
  return (
    <div className="App">
      <h1>About the WowClassicPopulation project</h1>
      <div className="box-wrapper normal">
        <h2>What</h2>
        <p>
          I&apos;m currently gathering character data from the classic beta and stress test realms.
          This data includes character names, realm, faction, race, class, level and guild. This
          data is funneled into an online database, so that I can generate some fancy charts out of
          it so that everyone can have a easy look on it.
        </p>
        <h2>How</h2>
        <p>
          I have forked the client 7.3.5 version of CenusPlus and fixed it to work with the beta
          client. CenusPlus is an addon that basically chains /who request in an intelligent way, so
          that it can gather as much as possible characters that are currently online on a realm.
          The addon saves all this data in a *.lua file that then can be uploaded onto this website
          to merge it with the gathered data of other people.
        </p>
        <h2>Who</h2>
        <p>
          Currently I&apos;m working alome on this project and so far I gathered all character data
          by myself, but I would really appreciate if more people would join and start gathering
          data.
        </p>
        <h2>Motivation</h2>
        <p>
          I&apos;m a junior web developer and using this project to sharpen my addon and web
          development skills.
        </p>
        <h2>When</h2>
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

export default About;
