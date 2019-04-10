import React, { Component } from 'react';
import DocTableRow from '../components/DocTableRow';

export default class DocTable extends Component {
  render() {
    const {lines} = this.props;
    return (
      <div className="doc-table-container">
        <table className="doc-table"><tbody>
          {lines.map((line, i) => {
            return <DocTableRow 
              key={line.id ? line.id : 'new'} 
              index={i} line={line} />
          })}
        </tbody></table>
      </div>
    )
  }
}
