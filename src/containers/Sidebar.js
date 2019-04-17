import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import SidebarItem from '../components/SidebarItem';
import { creatingDocument } from '../redux/actions';

class Sidebar extends Component {
  handleNew = (e) => {
    this.props.createDocument();
  }

  render() {
    return (
      <div className="sidebar">
        <Menu vertical>
          <Menu.Item>
            <Menu.Header>Documents</Menu.Header>
            <Menu.Menu>
              {this.props.documents.map(doc => {
                return <Menu.Item as={NavLink} 
                  to={`/documents/${doc.id}`}
                  onClick={() => window.location.href = `/documents/${doc.id}`}
                  key={doc.id} name={doc.title} />
              })}
            </Menu.Menu>
          </Menu.Item>
          <Menu.Item 
            className="sidebar-action new-link"
            onClick={this.handleNew} 
            name="New Document" />
        </Menu>
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