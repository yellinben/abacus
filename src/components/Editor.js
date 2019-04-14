import React, { Component } from 'react'
import { connect } from 'react-redux'

import './Editor.scss'

class Editor extends Component {
  handleChange = (e) => {
    console.log('change', e);
  }

  render() {
    const {doc} = this.props;
    const content = doc.lines
      .map(l => l.input).join('\n')

    return (
      <div className="editor-container doc-editor-container">
        <pre contentEditable
          className="editor-code" 
          onChange={this.handleChange}>
          {content}
        </pre>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    doc: state.document
  };
}

// const mapDispatchToProps = (dispatch) => {
//   return {};
// }

export default connect(mapStateToProps)(Editor);