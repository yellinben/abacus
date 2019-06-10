import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { fetchingSheets } from './redux/actions'

import { Grid, Container } from 'semantic-ui-react';

import Sidebar from './containers/Sidebar';
import DocContainer from './containers/DocContainer';

import './App.scss'

class App extends Component {
  componentDidMount() {
    this.props.fetchSheets();
  }

  render() {
    return (
      <div className="app-container">
        <Grid container columns={12}>
          <Grid.Column width={3}>
            <Route path="/" 
              component={Sidebar} />
          </Grid.Column>
          <Grid.Column width={12}>
            <Route exact
              path="/sheets/:sheetId"
              component={DocContainer} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({sheets}) => {
  return {sheets};
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSheets: () => {
      dispatch(fetchingSheets())
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
