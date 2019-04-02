import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { fetchingDocuments } from './redux/actions'

import Sidebar from './containers/Sidebar';
import DocPage from './containers/DocPage';

class App extends Component {
  componentDidMount() {
    this.props.fetchingDocuments();
  }

  render() {
    return (
      <div className="App">
        <Route path="/" 
          component={Sidebar} />
        <Route exact
          path="/documents/:docId"
          component={DocPage} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchingDocuments: () => {
      dispatch(fetchingDocuments())
    }
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
