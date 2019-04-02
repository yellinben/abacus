import React, { Component } from 'react'

class PageLine extends Component {
  render() {
    return (
      <div className="page-line">
        {this.props.line.input}
      </div>
    )
  }
}

export default PageLine