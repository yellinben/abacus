import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState } from 'draft-js';

import 'draft-js/dist/Draft.css';
import './DocEditor.scss';

class DocEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.doc !== this.props.doc) {
      this.loadContent();
    }
  }

  loadContent() {
    const content = this.props.doc.contents.join('\n');
    const contentState = ContentState.createFromText(content);

    this.setState({
      editorState: EditorState.createWithContent(contentState)
    });
  }

  handleChange = (editorState) => {
    console.log('change', editorState);
    this.setState({editorState});
  }

  render() {
    const {doc} = this.props;
     return (
      <div className="editor-container doc-editor-container">
        <Editor 
          editorState={this.state.editorState} 
          onChange={this.handleChange} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {doc: state.document};
}

export default connect(mapStateToProps)(DocEditor);