import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { fetchingDocument } from '../redux/actions'

import '../Document.scss'
import DocTable from './DocTable';

class DocumentContainer extends Component {
  componentDidMount() {
    const params = this.props.match.params;
    this.props.fetchingDocument(params.docId);
  }

  render() {
    const {doc} = this.props;
    return (
      <div className="doc-page-container">
        {!doc ? 
          <h3>Loading</h3> :
          <Fragment>
            <h1>{doc.title}</h1>
            <DocTable lines={doc.lines}></DocTable>
          </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentContainer);