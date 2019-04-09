import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  updatingLine,
  addLine
} from '../redux/actions';

class DocTableRow extends Component {
  handleChange = (e) => {
    if (e.target.value !== this.props.line.input) {
      this.props.line.input = e.target.value;
      this.lineChanged();
    }
  }

  // automatically move cursor to end of input on focus
  handleFocus = (e) => {
    const input = e.target;
    const length = input.value.length;
    // console.log('handleFocus', length);
    setTimeout(() => {
      input.setSelectionRange(length, length);
    }, 0);
  }

  handleKeyDown = (e) => {
    if (e.which === 13) {
      // detect 'enter' keypress
      this.props.addLine();
    } else if (e.which === 27) {
      // detect 'esc' keypress
      e.target.blur();
    } else if (e.which === 38) {
      // detect 'up' keypress
      // select previous line
    } else if (e.which === 40) {
      // detect 'down' keypress
      // select next line
    } else {
      // console.log('keydown', e.which);
    }
  }

  lineChanged() {
    this.props.updateLine(this.props.line); 
  }

  render() {
    const {line} = this.props;
    const modeClass = `mode-${line.mode}`

    return (
      <tr className={`doc-table-row ${modeClass}`}>
        <td className="row-input">
          {this.props.debug ?
            line.expression :
            <input type="text" 
              defaultValue={line.input} 
              onBlur={this.handleChange} 
              onFocus={this.handleFocus}
              onKeyDown={this.handleKeyDown} />
          }
        </td>
        <td className="row-result">{line.result}</td>
      </tr>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    debug: state.config.debug
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(DocTableRow);