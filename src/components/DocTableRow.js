import React, { Component } from 'react'

class DocTableRow extends Component {
  render() {
    const {line} = this.props;
    return (
      <tr>
        <td>{line.input}</td>
        <td>{line.result}</td>
      </tr>
    )
  }
}

export default DocTableRow