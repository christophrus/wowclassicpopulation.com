import React, { Component } from 'react';
import queryString from 'query-string';
import LineChartFilterForm from './components/LineChartFilterForm';
import LineChart from './components/LineChart';
import getRealmList from './helper/getRealmList';

class Activity extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      activityStats: null,
      realmOptions: null,
      query: {},
      width: 0,
      height: 0
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { query } = this.state;
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.getActivityStats(query);
    getRealmList(realms => {
      this.setState({
        realmOptions: realms
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

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
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const { activityStats, realmOptions, query, width, height } = this.state;

    let chartHeight = 550;
    let chartWidth = 600;

    const chartMargin = { top: 50, right: 50, bottom: 50, left: 50 };

    if (width < 600) {
      chartWidth = width <= 360 ? 360 * 0.96 : width * 0.96;
      chartHeight = chartWidth / 1.5;
      chartMargin.right = 10;
    } else {
      chartWidth = width * 0.96;
      if (height > 800) {
        chartHeight = height - 400;
      }
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
              margin={chartMargin}
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
