import React, { Component } from 'react';
import { connect } from 'react-redux';

import SidebarItem from '../components/SidebarItem';

class Sidebar extends Component {
  render() {
    return (
      <ul>{this.props.documents.map(doc => {
        return <SidebarItem key={doc.id} doc={doc} />
      })}</ul>
    );
  }
}

const mapStateToProps = state => {
  return {
    documents: state.documents
  };
}

export default connect(mapStateToProps)(Sidebar);