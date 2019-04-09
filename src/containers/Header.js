import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  render() {
    return (
      <header className="app-header">
        <h1 className="header-logo">
          <Link to="/">Abacus</Link>
        </h1>
      </header>
    )
  }
}
