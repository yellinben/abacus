import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState, SelectionState } from 'draft-js';
import { isEqual, debounce } from 'lodash';

import 'draft-js/dist/Draft.css';
import './DocEditor.scss';

import { updatingDocumentContent } from '../redux/actions';

class DocEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputState: EditorState.createEmpty(),
      inputLoaded: false,
      resultState: EditorState.createEmpty(),
      selectionState: SelectionState.createEmpty()
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.doc !== this.props.doc) {
      this.loadContent();
    }
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
    const prevContent = this.editorText();
    const newContent = editorState.getCurrentContent().getPlainText('\n');

    this.setState({
      inputState: editorState,
      selectionState: editorState.getSelection()
    });
    
    if (!isEqual(prevContent, newContent))
      this.handleContentChange();
  }

  handleContentChange = debounce(() => {
    // console.log('contentChange', this.editorLines());
    this.props.updateContent(this.props.doc, this.editorLines());
  }, 200);

  render() {
     return (
      <div className="editor-container doc-editor-container">
        <div className="doc-editor input-editor">
          <Editor editorState={this.state.inputState} 
            onChange={this.handleChange}
            stripPastedStyles={true} />
        </div>
        <div className="doc-editor result-editor">
          <Editor editorState={this.state.resultState} 
            readOnly={true} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {doc: state.document};
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateContent: (doc, content) => {
      dispatch(updatingDocumentContent(doc, content))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocEditor);