import React, { Component } from 'react';
import { connect } from 'react-redux';

import SidebarItem from '../components/SidebarItem';
import { creatingDocument } from '../redux/actions';

class Sidebar extends Component {
  handleNew = (e) => {
    console.log('new');
    this.props.createDocument();
  }

  render() {
    return (
      <div className="sidebar">
        <ul>{this.props.documents.map(doc => {
          return <SidebarItem key={doc.id} doc={doc} />
        })}</ul>
        <div className="sidebar-actions">
          <a href="#" 
            onClick={this.handleNew}
            className="sidebar-action new-link">
            New Document
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    documents: state.documents
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createDocument: () => {
      dispatch(creatingDocument());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);