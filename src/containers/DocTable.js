import React, { Component } from 'react';
import DocTableRow from '../components/DocTableRow';

export default class DocTable extends Component {
  render() {
    const {lines} = this.props;
    return (
      <div className="doc-table-container">
        <table className="doc-table"><tbody>
          {lines.map(line => {
            const line_key = line.id ? line.id : 'new';
            return <DocTableRow key={line_key} line={line} />
          })}
        </tbody></table>
      </div>
    )
  }
}
