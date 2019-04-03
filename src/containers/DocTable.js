import React, { Component } from 'react'
import DocTableRow from '../components/DocTableRow'

export default class DocTable extends Component {
  render() {
    const {lines} = this.props;
    return (
      <table>
        <tbody>
          {lines.map(line => <DocTableRow line={line} />)}
        </tbody>
      </table>
    )
  }
}
