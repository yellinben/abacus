import React, { Component } from 'react'

import './CopyCell.scss';

export default class CopyCell extends Component {
  handleClick = (e) => {
    console.log('click', e.target, e.currentTarget);
    // copyText(e.target);
    // e.currentTarget.select();
    // document.execCommand('copy');
  }

  copyText(elem) {
    
  }

  render() {
    return (
      <span className="copy-cell"
        onClick={this.handleClick}>
        {this.props.text}
      </span>
    )
  }
}
