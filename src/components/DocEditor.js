import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState } from 'draft-js';

import 'draft-js/dist/Draft.css';
import './DocEditor.scss';

class DocEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputState: EditorState.createEmpty(),
      resultState: EditorState.createEmpty()
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.doc !== this.props.doc) {
      this.loadContent();
    }
  }

  loadContent() {
    const contents = [];
    const results = [];

    this.props.doc.lines.forEach(line => {
      console.log(line);
      contents.push(line.input);
      results.push(line.result_formatted);
    });

    const inputContentState = ContentState.createFromText(contents.join('\n'));
    const resultContentState = ContentState.createFromText(results.join('\n'));

    this.setState({
      inputState: EditorState.createWithContent(inputContentState),
      resultState: EditorState.createWithContent(resultContentState)
    });
  }

  handleChange = (editorState) => {
    this.setState({editorState});
  }

  render() {
     return (
      <div className="editor-container doc-editor-container">
        <Editor className="doc-input-editor"
          editorState={this.state.inputState} 
          onChange={this.handleChange} />
        <Editor className="doc-result-editor"
          editorState={this.state.resultState} 
          readOnly={true} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {doc: state.document};
}

export default connect(mapStateToProps)(DocEditor);