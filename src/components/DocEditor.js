import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState, CompositeDecorator, convertToRaw } from 'draft-js';
import { debounce } from 'lodash';

import 'draft-js/dist/Draft.css';
import './DocEditor.scss';

import { updatingEditor } from '../redux/actions';

// https://reactrocket.com/post/draft-js-search-and-replace/

// const findWithRegex = (regex, contentBlock, callback) => {
//   const text = contentBlock.getText();
//   let matchArr, start, end;
//   while ((matchArr = regex.exec(text)) !== null) {
//     start = matchArr.index;
//     end = start + matchArr[0].length;
//     callback(start, end);
//   }
// };

// const generateDecorator = (highlightTerm, component) => {
//   const regex = new RegExp(highlightTerm, 'g');
//   return new CompositeDecorator([{
//     strategy: (contentBlock, callback) => {
//       console.log('generateDecorator', contentBlock.getText());
//       if (highlightTerm !== '') {
//         findWithRegex(regex, contentBlock, callback);
//       }
//     }, component
//   }])
// };

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const CommentSpan = (props) => {
  return <span style={styles.comment}>{props.children}</span>;
};

const OperatorSpan = (props) => {
  return <span style={styles.operator}>{props.children}</span>;
};

const NumberSpan = (props) => {
  return <span style={styles.number}>{props.children}</span>;
};

const FunctionSpan = (props) => {
  return <span style={styles.func}>{props.children}</span>;
};

const VariableSpan = (props) => {
  return <span style={styles.var}>{props.children}</span>;
};

const COMMENT_REGEX = /^\s*\/\/.*$/g;
const OPERATOR_REGEX = /\b([\*/\+=%-]|off|of|on|as|to)\b/g;
const NUM_REGEX = /\b[\$-]?[\d.]+%?/g;
const FUNC_REGEX = /\b(min|max|sum|avg|count|round|rounddown|roundup|sin|cos|tan)/gi;
const UNIT_REGEX = /\b(ft|feet|in|inches|m|meters|km|kilometers)/gi;
const VAR_REGEX = /^[a-z0-9_-]+ /gi;

const styles = {
  comment: {color: 'gray'},
  operator: {color: 'orange'},
  number: {color: 'blue'}, 
  func: {color: 'green'},
  var: {color: 'purple'}
}

function commentStrategy(contentBlock, callback, contentState) {
  findWithRegex(COMMENT_REGEX, contentBlock, callback);
}

function operatorStrategy(contentBlock, callback, contentState) {
  findWithRegex(OPERATOR_REGEX, contentBlock, callback);
}

function numberStrategy(contentBlock, callback, contentState) {
  findWithRegex(NUM_REGEX, contentBlock, callback);
}

function funcStrategy(contentBlock, callback, contentState) {
  findWithRegex(FUNC_REGEX, contentBlock, callback);
}

function varStrategy(contentBlock, callback, contentState) {
  findWithRegex(VAR_REGEX, contentBlock, callback);
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: commentStrategy,
    component: CommentSpan,
  },
  {
    strategy: operatorStrategy,
    component: OperatorSpan,
  },
  {
    strategy: numberStrategy,
    component: NumberSpan,
  },
  {
    strategy: funcStrategy,
    component: FunctionSpan,
  },
  {
    strategy: varStrategy,
    component: VariableSpan,
  },
]);

// const findCommentEntities = (contentState, contentBlock, callback) => {
//   console.log('findCommentEntities', contentBlock);
//   contentBlock.findEntityRanges(
//     (character) => {
//       const entityKey = character.getEntity();
//       return (
//         entityKey !== null &&
//         contentState.getEntity(entityKey).getType() === 'COMMENT'
//       );
//     }, callback);
// };

// const commentDecorator = generateDecorator('^//');

// const decorators = new CompositeDecorator([
//   {
//     strategy: findCommentEntities,
//     component: CommentEntity,
//   }
// ])

class DocEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputState: EditorState.createEmpty(compositeDecorator)
    };
  }

  // lines = () => this.props.doc.lines;
  // contents = () => this.props.doc.contents;
  // results = () => this.lines().map(l => l.result_formatted);

  // contentText = () => this.contents().join('\n');
  // resultText = () => this.results().join('\n');

  // editorContent = () => this.state.inputState.getCurrentContent();
  // editorText = () => this.editorContent().getPlainText('\n');
  // editorLines = () => this.editorText().split('\n');

  handleChange = (editorState) => {
    if (this.state.inputState !== editorState) {
      this.setState({
        inputState: EditorState.set(editorState, 
          {decorator: compositeDecorator})
      });
      this.handleContentChange(editorState);
    }
  }

  handleContentChange = debounce((editorState) => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    console.log('handleContentChange', rawContent);
    this.props.updateContent(this.props.doc, rawContent);
  }, 100);

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
    inputState: EditorState.set(state.editor.inputState, {decorator: compositeDecorator}),
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