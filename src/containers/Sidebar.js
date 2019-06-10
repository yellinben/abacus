import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import { creatingSheet } from '../redux/actions';

import './Sidebar.scss';

class Sidebar extends Component {
  handleNew = (e) => {
    this.props.createSheet();
  }

  render() {
    return (
      <div className="sidebar">
        <Menu vertical>
          <Menu.Item>
            <Menu.Header className="header-title">Abacus</Menu.Header>
            <Menu.Menu>
              {this.props.sheets.map(sheet => {
                return <Menu.Item as={NavLink} 
                  to={`/sheets/${sheet.slug()}`}
                  key={sheet.id} name={sheet.title} />
              })}
            </Menu.Menu>
          </Menu.Item>
          <Menu.Item 
            className="sidebar-action new-link"
            onClick={this.handleNew} 
            name="New Sheet" />
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sheets: state.sheets
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createSheet: () => {
      dispatch(creatingSheet());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
