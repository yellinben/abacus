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
    if (prevProps.doc !== this.props.doc) {
      this.loadContent();
    }
  }

  contentText = () => this.props.doc.contents.join('\n');
  editorText = () => this.state.inputState.getCurrentContent().getPlainText('\n');
  results = () => this.props.docs.lines.map(l => l.result_formatted).join('\n');

  // createContentState(contents) {
  //   return ContentState.createFromText(contents.join('\n'));
  // }
  
  // createEditorState = (contents) => {
  //   EditorState.createWithContent(this.createContentState(contents));

  loadContent() {
    const contents = [];
    const results = [];

    this.props.doc.lines.forEach(line => {
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
    const prevContent = this.contentText();
    const newContent = this.editorText();
 
    this.setState({inputState: editorState});
    
    if (!isEqual(prevContent, newContent))
      this.handleContentChange();
  }

  handleContentChange = debounce(() => {
    this.props.updateContent(this.props.doc, this.editorText());
  }, 400);

  render() {
     return (
      <div className="editor-container doc-editor-container">
        <Editor className="doc-input-editor"
          editorState={this.state.inputState} 
          onChange={this.handleChange} />
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