import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  updatingLine,
  addLine
} from '../redux/actions';

class DocTableRow extends Component {
  docId = () => this.props.match.params.docId

  handleChange = (e) => {
    if (e.target.value !== this.props.line.input) {
      this.props.line.input = e.target.value;
      this.lineChanged();
    }
  }

  handleKeydown = (e) => {
    // detect 'enter' or 'esc' keypress
    if (e.which === 13 || e.which === 27) addLine();
  }

  lineChanged() {
    this.props.updateLine(
      this.docId(), 
      this.props.line); 
  }

  render() {
    const {line} = this.props;
    return (
      <tr className="doc-table-row">
        <td className="row-input">
          <input type="text" 
            defaultValue={line.input} 
            onBlur={this.handleChange} 
            onKeyDown={this.handleKeydown} />
        </td>
        <td className="row-result">{line.result}</td>
      </tr>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLine: (line) => {
      dispatch(updatingLine(line))
    },
    addLine: () => {
      dispatch(addLine())
    }
  }
}

export default connect(null, mapDispatchToProps)(DocTableRow);