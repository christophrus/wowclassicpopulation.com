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
      query: {},
      width: 0
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { query } = this.state;
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.getActivityStats(query);
    this.getRealmList();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
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

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    const { activityStats, realmOptions, query, width } = this.state;

    let chartHeight = 400;
    let chartWidth = 600;

    if (width < 600) {
      chartWidth = width < 360 ? 360 : width * 0.9;
      chartHeight = chartWidth / 1.5;
    }

    if (width <= 360) {
      chartWidth = 360;
    }

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
              width={chartWidth}
              height={chartHeight}
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
