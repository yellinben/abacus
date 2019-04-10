import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import {
  updatingLine,
  deletingLine,
  addLine,
  selectLineRelative,
  selectedLine
} from '../redux/actions';

class DocTableRow extends Component {
  constructor(props) {
    super(props);
    this.textField = React.createRef();
  }

  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate() {
    if (this.props.selected)
      this.textField.current.focus();
  }

  handleChange = (e) => {
    if (!this.props.debug && e.target.value !== this.props.line.input) {
      this.props.line.input = e.target.value;
      this.lineChanged();
    }
  }

  // automatically move cursor to end of input on focus
  handleFocus = (e) => {
    // const input = e.target;
    // const length = input.value.length;

    // setTimeout(() => {
    //   input.setSelectionRange(length, length);
    // }, 0);

    this.props.lineSelected(this.props.line);
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
      this.props.selectPrevLine();
    } else if (e.which === 40) {
      // detect 'down' keypress
      this.props.selectNextLine();
    } else if (e.which === 8) {
      // detect 'backspace' keypress
      if (isEmpty(this.props.line.input))
        this.props.deleteLine(this.props.line)
    } else {
      console.log('keydown', e.which);
    }
  }

  lineChanged() {
    this.props.updateLine(this.props.line); 
  }

  render() {
    const {line} = this.props;
    const modeClass = `mode-${line.mode}`
    const lineText = this.props.debug ? line.expression : line.input;

    return (
      <tr className={`doc-table-row ${modeClass}`}>
        <td className="row-input">
          <input type="text" 
            ref={this.textField}
            value={lineText} 
            onChange={this.handleChange} 
            onBlur={this.handleChange} 
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown} />
        </td>
        <td className="row-result">{line.result}</td>
      </tr>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    debug: state.config.debug,
    selected: state.document.selectedLineIndex === ownProps.index
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLine: (line) => {
      dispatch(updatingLine(line))
    },
    deleteLine: (line) => {
      dispatch(deletingLine(line))
    },
    addLine: () => {
      dispatch(addLine())
    },
    selectPrevLine: () => {
      dispatch(selectLineRelative(-1))
    },
    selectNextLine: () => {
      dispatch(selectLineRelative(1))
    },
    lineSelected: (line) => {
      dispatch(selectedLine(line))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocTableRow);