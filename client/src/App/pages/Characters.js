import React, { Component } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import BarChartFilterForm from './components/BarChartFilterForm';
import CharacterChart from './components/CharacterChart';
import getRealmList from './helper/getRealmList';

class Characters extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      realmOptions: null,
      query: null,
      characterStats: null
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    this.getCharacterStats(query);
    getRealmList(realms => {
      this.setState({
        realmOptions: realms
      });
    });
  }

  // Retrieves the list of items from the Express app
  getCharacterStats = (query, cb) => {
    const qs = queryString.stringify(query);
    window
      .fetch(`/api/stats/characters?${qs}`)
      .then(res => res.json())
      .then(characterStats => {
        this.setState({
          characterStats
        });
        if (cb) cb(characterStats);
      });
  };

  handleFilterChange = query => {
    const { history } = this.props;
    const qs = queryString.stringify(query);
    history.push({
      pathname: '/characters',
      search: qs
    });
    this.setState({ query });
    this.getCharacterStats(query);
  };

  render() {
    const { characterStats, realmOptions, query } = this.state;

    let filterPanel;

    if (realmOptions !== null) {
      filterPanel = (
        <BarChartFilterForm realmOptions={realmOptions} onChange={this.handleFilterChange} />
      );
    }

    return (
      <div className="App">
        <h1>Characters</h1>
        <p className="intro" style={{ marginBottom: '10px' }}>
          The character charts can give you a good idea about the Wow Classic Population especially
          regarding to the balance of factions on a realm as well as about race, class and level
          distribution. Currently there is only census data from the Wow Classic beta and stress
          test realms, but as soon as Classic launches, we aim to cover all this new realms, too.
          You can use the filter options to get an even deeper insight if you wanna take a look into
          something more special. By the way you can also select multiple realms at once.
        </p>
        {characterStats === null ? (
          <div>Loading data</div>
        ) : (
          <div>
            {filterPanel}
            <CharacterChart
              realmOptions={realmOptions}
              characterStats={characterStats}
              query={query}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Characters);
