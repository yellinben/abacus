import React, { Component } from 'react'
import copy from 'copy-to-clipboard';

import './CopyCell.scss';

export default class CopyCell extends Component {
  handleCopy = (e) => {
    copy(this.props.text, {debug: true}); 
  }

  render() {
    return (
      <span className="copy-cell"
        onDoubleClick={this.handleCopy}>
        {this.props.text}
      </span>
    )
  }
}
