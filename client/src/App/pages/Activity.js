import React, { Component } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import LineChartFilterForm from './components/LineChartFilterForm';
import getRealmList from './helper/getRealmList';
import ActivityChart from './components/ActivityChart';

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
    const { location } = this.props;
    const query = queryString.parse(location.search);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.getActivityStats(query);
    getRealmList(realms => {
      this.setState({
        realmOptions: realms,
        query
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
    const { history } = this.props;
    const qs = queryString.stringify(query);
    history.push({
      pathname: '/activity',
      search: qs
    });
    this.setState({ query });
    this.getActivityStats(query);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const { activityStats, realmOptions, query, width, height } = this.state;

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
          <ActivityChart
            width={width}
            height={height}
            query={query}
            activityStats={activityStats}
          />
        )}
      </div>
    );
  }
}

export default withRouter(Activity);
