import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { fetchingDocuments } from './redux/actions'

import Sidebar from './containers/Sidebar';
import DocumentContainer from './containers/DocumentContainer';

class App extends Component {
  componentDidMount() {
    this.props.fetchDocuments();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // did our documents update?
  //   if (this.props.docs !== prevProps.docs) {
  //   }
  // }

  render() {
    return (
      <div className="App">
        <Route path="/" 
          component={Sidebar} />
        <Route exact
          path="/documents/:docId"
          component={DocumentContainer} />
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
