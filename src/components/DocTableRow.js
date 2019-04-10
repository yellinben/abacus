import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  updatingLine,
  deletingLine,
  addLine,
  selectLineRelative,
  selectedLine
} from '../redux/actions';

import CopyCell from './CopyCell';

class DocTableRow extends Component {
  constructor(props) {
    super(props);
    this.textField = React.createRef();
    this.state = {lineInput: props.line.input};
  }

  componentDidUpdate() {
    if (this.props.selected)
      this.textField.current.focus();
  }

  handleBlur = (e) => {
    if (this.props.line.input !== this.state.lineInput)
      this.lineChanged();
  }

  // automatically move cursor to end of input on focus
  handleFocus = (e) => {
    // const input = e.target;
    // const length = input.value.length;

    // setTimeout(() => {
    //   input.setSelectionRange(length, length);
    // }, 0);

    this.props.lineSelected(this.state.line);
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
      // if backspace occurs at start of line
      // delete the entire line
      if (!this.state.lineInput.length)
        this.props.deleteLine(this.props.line);
    } else {
      // console.log('keydown', e.which);
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  lineChanged() {
    this.props.updateLine({
      ...this.props.line,
      input: this.state.lineInput
    }); 
  }

  render() {
    const {line} = this.props;
    const modeClass = `mode-${line.mode}`

    return (
      <tr className={`doc-table-row ${modeClass}`}>
        <td className="row-input">
            <input type="text" 
              name="lineInput"
              autoComplete="off" 
              ref={this.textField}
              defaultValue={this.state.lineInput}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onKeyDown={this.handleKeyDown} />
        </td>
        <td className="row-result">
          {!line.result ? null :
            <CopyCell text={line.result} />}
        </td>
      </tr>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    debug: state.config.debug,
    text: state.config.debug ? ownProps.line.expression : ownProps.line.input,
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