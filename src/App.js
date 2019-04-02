import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchingDocuments } from './redux/actions'
import Sidebar from './containers/Sidebar';

class App extends Component {
  componentDidMount() {
    this.props.fetchingDocuments();
  }

  render() {
    return (
      <div className="App">
        <Sidebar />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchingDocuments: () => {dispatch(fetchingDocuments())}
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
