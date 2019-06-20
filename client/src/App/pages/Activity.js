import React, { Component } from 'react';
import queryString from 'query-string';
import LineChartFilterForm from './components/LineChartFilterForm';
import LineChart from './components/LineChart';

class Activity extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      activityStats: null,
      realmOptions: null,
      query: {}
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { query } = this.state;
    this.getActivityStats(query);
    this.getRealmList();
  }

  getRealmList = () => {
    window
      .fetch(`api/list/realms`)
      .then(res => res.json())
      .then(realmList => {
        this.setState({
          realmOptions: this.selectMapper(realmList.realms)
        });
      });
  };

  selectMapper = data => {
    return data.map(element => ({
      value: String(element)
        .toLowerCase()
        .replace(/\s/g, '_'),
      label: element
    }));
  };

  // Retrieves the list of items from the Express app
  getActivityStats = (query, cb) => {
    const qs = queryString.stringify(query);

    window
      .fetch(`/api/stats/activity?${qs}`)
      .then(res => res.json())
      .then(activityStats => {
        this.setState({
          activityStats
        });
        if (cb) cb(activityStats);
      });
  };

  handleFilterChange = query => {
    this.setState({ query });
    this.getActivityStats(query);
  };

  render() {
    const { activityStats, realmOptions, query } = this.state;

    let filterPanel;

    if (realmOptions !== null) {
      filterPanel = (
        <LineChartFilterForm realmOptions={realmOptions} onChange={this.handleFilterChange} />
      );
    }

    return (
      <div className="App">
        <h1>Activity</h1>
        {filterPanel}
        {activityStats === null ? (
          <div>Loading data</div>
        ) : (
          <div>
            <LineChart
              id="activity-chart"
              className="chart-container box-wrapper"
              data={activityStats}
              query={query}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Activity;
