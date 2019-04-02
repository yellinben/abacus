import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchingDocument } from '../redux/actions'

class DocPage extends Component {
  componentDidMount() {
    const params = this.props.match.params;
    this.props.fetchingDocument(params.docId);
  }

  render() {
    return (
      <div className="doc-page-container">
        {!this.props.doc ? 
         <h3>Loading</h3> :
         <h1>{this.props.doc.title}</h1>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    doc: state.document
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchingDocument: (id) => {
      dispatch(fetchingDocument(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocPage);