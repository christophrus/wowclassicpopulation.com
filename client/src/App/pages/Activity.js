import React, { Component } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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

    const description =
      'Realm activity gives an overview about the active players concurrently online on Wow Classic realms in chart form';
    const title = 'Population activity overview - Wow Classic population census project';

    return (
      <div className="App">
        <Helmet>
          <meta name="description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
          <title>{title}</title>
        </Helmet>
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
        <p className="intro" style={{ marginTop: '10px' }}>
          The activity charts can give you a good idea about the active Wow Classic Population.
          Currently there is only census data from the Wow Classic Beta and stress test realms but
          we aim to provide data from all the new realms that are coming when Classic launches as
          well. You maybe need to select a specific time frame to get more meaningful results.
        </p>
      </div>
    );
  }
}

export default withRouter(Activity);
