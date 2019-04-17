import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Editor, EditorState, ContentState, SelectionState } from 'draft-js';
import ContentEditable from 'react-contenteditable';
import { isEqual, debounce } from 'lodash';

// import 'draft-js/dist/Draft.css';
import './DocEditor.scss';

import { updatingDocumentContent } from '../redux/actions';

class DocEditor extends Component {
  constructor(props) {
    super(props);

    const lines = props.doc.lines;
    const inputLines = lines.map(l => l.input);
    const resultLines = lines.map(l => l.result_formatted);

    this.editorRef = React.createRef();

    this.state = {
      // inputState: EditorState.createEmpty(),
      inputLoaded: false,
      inputContent: '',
      lines, inputLines, resultLines,
      selection: window.getSelection()
      // resultState: EditorState.createEmpty(),
      // selectionState: SelectionState.createEmpty()
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.doc !== this.props.doc) {
      const lines = this.props.doc.lines;
      const inputLines = lines.map(l => l.input);
      const resultLines = lines.map(l => l.result_formatted);

      const inputHTML = inputLines.map(l => (
        `<div class="editor-line">${l ? l : '&nbsp;'}</div>`
      )).join('');

      const resultHTML = resultLines.map(l => (
        `<div class="editor-line">${l ? l : '&nbsp;'}</div>`
      )).join('');

      this.setState({
        lines, inputLines, resultLines,
        inputHTML, resultHTML
      });
      // this.loadContent();
    }

    // if (prevState.inputLines !== this.state.inputLines) {
    //   this.handleContentChange();
    // } else {
    //   console.log('equal', prevState.inputLines, this.state.inputLines);
    // }
  }

  // lines = () => this.props.doc.lines;
  // contents = () => this.props.doc.contents;
  // results = () => this.lines().map(l => l.result_formatted);

  // contentText = () => this.contents().join('\n');
  // resultText = () => this.results().join('\n');

  // inputHTML() {
  //   return <pre className="editor-code">{
  //     this.props.lines.map(line => <div className="editor-line"></div>)
  //   }</pre>
  // }

  // editorContent = () => this.state.inputState.getCurrentContent();
  // editorText = () => this.editorContent().getPlainText('\n');
  // editorLines = () => this.editorText().split('\n');

  // loadContent() {
  //   const resultContentState = ContentState.createFromText(this.resultText());
  //   const newState = {resultState: EditorState.createWithContent(resultContentState)};

  //   // prevent reloading input editor component
  //   // to help maintain cursor position on update
  //   // workaround, should be fixed
  //   if (!this.state.inputLoaded) {
  //     const inputContentState = ContentState.createFromText(this.contentText());
  //     newState.inputState = EditorState.createWithContent(inputContentState);
  //     newState.inputLoaded = true;
  //   }

  //   this.setState(newState);
  // }

  // handleChange = (editorState) => {
  //   const prevContent = this.editorText();
  //   const newContent = editorState.getCurrentContent().getPlainText('\n');

  //   this.setState({
  //     inputState: editorState,
  //     selectionState: editorState.getSelection()
  //   });
    
  //   if (!isEqual(prevContent, newContent))
  //     this.handleContentChange();
  // }

  handleChange = (e) => {
    const prevInputLines = this.state.inputLines;
    const newInputLines = this.editorLines();
    // console.log(prevInputLines, this.editorLines());

    // var range = document.createRange();
    // var sel = window.getSelection();

    // range.setStart(target, target.nodeValue.length);
    // range.collapse(true);

    // sel.removeAllRanges();
    // sel.addRange(range);

    this.setState({
      inputLines: this.editorLines(),
      inputHTML: e.target.value,
      selection: window.getSelection()
    });

    if (prevInputLines !== newInputLines) {
      this.handleContentChange();
    } else {
      console.log('equal', prevInputLines, this.state.inputLines);
    }
  }

  editorLines() {
    return this.editorRef.current
      .innerText.split('\n');
  }

  splitHTML(elem) {
    return elem.innerText.split('\n');
  }
  
  // buildEditorHTML() {
  //   return this.state.lines.map(l => {
  //     return `<div class="editor-line">${l.input}</div>`;
  //   }).join('');
  // }

  inputHTML() {
    return this.state.lines.map(l => (
      `<div class="editor-line">${l.input}</div>`
    )).join('');
  }

  handleContentChange = debounce(() => {
    console.log('contentChange')
    // this.props.updateContent(this.props.doc, this.state.inputLines);
  }, 200);

  render() {
    // const inputHTML = this.state.lines.map(l => {
    //   return `<div class="editor-line">${l.input}</div>`;
    // }).join('');

     return (
      <div className="editor-container doc-editor-container">
        <div className="doc-editor input-editor">
          <ContentEditable tagName='pre' 
            className='editor-code'
            innerRef={this.editorRef}
            html={this.state.inputHTML}
            onChange={this.handleChange} />
        </div>
        <div className="doc-editor result-editor">
          <ContentEditable tagName='pre' 
            className='editor-code' 
            html={this.state.resultHTML}
            disabled={true} />
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