import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';
import { isEqual, debounce } from 'lodash';

import 'draft-js/dist/Draft.css';
import './DocEditor.scss';

import { updatingDocumentContent } from '../redux/actions';

class DocEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputState: EditorState.createEmpty(),
      resultState: EditorState.createEmpty()
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('update', prevProps);
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

  // createContentState(contents) {
  //   return ContentState.createFromText(contents.join('\n'));
  // }
  
  // createEditorState = (contents) => {
  //   EditorState.createWithContent(this.createContentState(contents));

  loadContent() {
    // const contents = [];
    // const results = [];

    // this.props.doc.lines.forEach(line => {
    //   contents.push(line.input);
    //   results.push(line.result_formatted);
    // });

    // const inputContentState = ContentState.createFromText(this.contents.join('\n'));
    // const resultContentState = ContentState.createFromText(this.results.join('\n'));

    console.log(this.props.doc, this.lines());

    const inputContentState = ContentState.createFromText(this.contentText());
    const resultContentState = ContentState.createFromText(this.resultText());

    this.setState({
      inputState: EditorState.createWithContent(inputContentState),
      resultState: EditorState.createWithContent(resultContentState)
    });
  }

  handleChange = (editorState) => {
    this.setState({inputState: editorState});

    const prevContent = this.contentText();
    const newContent = this.editorText();
    
    if (!isEqual(prevContent, newContent))
      this.handleContentChange();
  }

  handleContentChange = debounce(() => {
    this.props.updateContent(this.props.doc, this.editorLines());
  }, 400);

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