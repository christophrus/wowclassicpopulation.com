import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="App">
      <h1>About</h1>
      <div className="box-wrapper normal">
        <h2>What is the project about?</h2>
        <p>
          I&apos;m currently gathering character data from the classic beta and stress test realms.
          This data includes character name, realm, faction, race, class, level, guild and an
          activity snapshot that captures how many people were concurrently online at a specific
          time. This data is funneled into an online database, so that some fancy charts can be
          generated out of it so that everyone can have an easy look on it.
        </p>
        <h2>How did you get the numbers?</h2>
        <p>
          I have forked the client 7.3.5 version of CenusPlus and fixed it to work with the beta
          client. CenusPlus is an addon that automatically chains /who request in an intelligent
          way, so that it can gather as much characters as possible that are currently online on a
          realm. The addon saves all this data in a *.lua file that then can be uploaded on this
          website where it gets merged with the gathered data of all other people.
        </p>
        <h2>Who made this website?</h2>
        <p>
          Currently I&apos;m working alone on this project and I&apos;ve gathered the initial
          character data samples by myself, but more and more people start gathering and submitting
          data and I would really appreciate it if even more people would join, so that we can grow
          an adequate sample size.
        </p>
        <h2>Whats the motivation behind it</h2>
        <p>
          I&apos;m a junior web developer and recently finished the{' '}
          <a href="https://learn.freecodecamp.org/">freeCodeCamp curriculum</a> and now using this
          project to improve my coding skills and to gather some real world experience. Not to
          mention that I absolutely love Vanilla WoW from back in the days and really hope that it
          will be a great success. Anyways I was lucky enough to get access to the WoW: Classic beta
          (specifically resubbed 1 month for a chance, LUL). Due to the lack of a working census
          addon and a website that could visualize it, I decided to start a project for this by
          myself.
        </p>
        <h2>What is the goal</h2>
        <p>
          For now the goal is it to track the population numbers of the beta and stress test realms
          as accurate as possible. The state of this website is like the one of WoW Classic: work in
          progress. At the moment I&apos;m working constantly on it and updates are pushed on a
          regular basis. My goal is it to improve, polish and make it as stable as possilbe until
          the launch of WoW: Classic, so that we can get a realistic idea about the classic
          population from the beginning.
        </p>
        <h2>How can I contribute</h2>
        <p>
          If you have access to the beta or stress test, it is highly appriciated that you install
          the{' '}
          <a href="https://github.com/christophrus/CensusPlusClassic/releases">CensusPlus Addon</a>{' '}
          and <Link to="./contribute">upload your gathered data</Link> to the website. Besides if
          you find any bugs or have some suggestions, feel free to join the project{' '}
          <a href="https://discord.gg/MYPWGkv">Discord</a> and post them there.
        </p>
        <h2>How can I contact you?</h2>
        <p>
          The best way to contact me is <a href="https://twitter.com/christophrus">Twitter</a> or in
          the project <a href="https://discord.gg/MYPWGkv">Discord</a>, you can also find me
          on&nbsp;
          <a href="https://www.reddit.com/user/christophrus">reddit</a>.
        </p>
      </div>
    </div>
  );
};

export default About;
