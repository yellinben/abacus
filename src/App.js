import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { fetchingDocuments } from './redux/actions'

import { Grid, Container } from 'semantic-ui-react';

import Sidebar from './containers/Sidebar';
import DocContainer from './containers/DocContainer';

import './App.scss'

class App extends Component {
  componentDidMount() {
    this.props.fetchDocuments();
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
              path="/documents/:docId"
              component={DocContainer} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    docs: state.documents
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDocuments: () => {
      dispatch(fetchingDocuments())
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
