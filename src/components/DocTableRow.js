import React, { Component } from 'react'

class DocTableRow extends Component {
  handleChange = (e) => {
    const old_input = this.props.line.input;
    const input = e.target.value;

    if (input !== old_input) {
      console.log('line updated', input);
    }
  }

  render() {
    const {line} = this.props;
    return (
      <tr className="doc-table-row">
        <td className="row-input">
          <input type="text" 
            defaultValue={line.input} 
            onBlur={this.handleChange} />
        </td>
        <td className="row-result">{line.result}</td>
      </tr>
    )
  }
}

export default DocTableRow;