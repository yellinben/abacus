import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState, SelectionState, convertToRaw } from 'draft-js';
import { debounce } from 'lodash';

import 'draft-js/dist/Draft.css';
import './DocEditor.scss';

import { updatingEditor } from '../redux/actions';

class DocEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputState: EditorState.createEmpty(),
      selectionState: SelectionState.createEmpty()
    };
  }

  lines = () => this.props.doc.lines;
  contents = () => this.props.doc.contents;
  results = () => this.lines().map(l => l.result_formatted);

  contentText = () => this.contents().join('\n');
  resultText = () => this.results().join('\n');

  editorContent = () => this.state.inputState.getCurrentContent();
  editorText = () => this.editorContent().getPlainText('\n');
  editorLines = () => this.editorText().split('\n');

  loadContent() {
    const resultContentState = ContentState.createFromText(this.resultText());
    const newState = {resultState: EditorState.createWithContent(resultContentState)};

    // prevent reloading input editor component
    // to help maintain cursor position on update
    // workaround, should be fixed
    if (!this.state.inputLoaded) {
      const inputContentState = ContentState.createFromText(this.contentText());
      newState.inputState = EditorState.createWithContent(inputContentState);
      newState.inputLoaded = true;
    }

    this.setState(newState);
  }

  handleChange = (editorState) => {
    this.setState({inputState: editorState});
    this.handleContentChange(editorState);
  }

  handleContentChange = debounce((editorState) => {
    // console.log('contentChange', this.editorLines());
    const rawContent = convertToRaw(editorState.getCurrentContent());
    this.props.updateContent(this.props.doc, rawContent);
  }, 500);

  render() {
     return (
      <div className="editor-container doc-editor-container">
        <div className="doc-editor input-editor">
          <Editor onChange={this.handleChange}
            editorState={EditorState.acceptSelection(this.props.inputState, this.state.inputState.getSelection())}
            stripPastedStyles={true} />
        </div>
        <div className="doc-editor result-editor">
          <Editor editorState={this.props.resultState} 
            readOnly={true} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    doc: state.document,
    inputState: state.editor.inputState,
    resultState: state.editor.resultState,
    rawContent: state.editor.rawContent
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateContent: (doc, content) => {
      // console.log('updateContent', content);
      dispatch(updatingEditor(doc, content))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocEditor);