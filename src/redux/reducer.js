import { combineReducers } from 'redux';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';

import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  DOCUMENT_CREATED,
  DOCUMENT_UPDATED,
  DOCUMENT_DELETED,
  UPDATE_EDITOR,
  UPDATE_RESULTS,
  TOGGLE_DEBUG,
  UPDATE_EDITOR_STATE,
  WRITE_EDITOR,
  WRITE_RESULTS
} from './types';

/* documents */

const documentsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCHED_DOCUMENTS:
      return action.payload;
    case DOCUMENT_CREATED:
      return [...state, action.payload];
    case DOCUMENT_UPDATED:
      return state.map(d => {
        return (d.id === action.payload.id) ? 
        action.payload : d;
      });
    case DOCUMENT_DELETED:
      return state.filter(d => {
        return d.id !== action.payload.id;
      });
    default:
      return state;
  }
}

/* document */

const defaultDoc = {
  title: "Untitled",
  contents: [],
  content: '',
  lines: []
};

const documentReducer = (state = defaultDoc, action) => {
  switch (action.type) {
    case FETCHED_DOCUMENT:
      return action.payload
    case DOCUMENT_UPDATED:
      return action.payload
    default:
      return state;
  }
}

/* input editor */

const defaultEditor = {
  contents: [],
  results: [],
  inputState: EditorState.createEmpty(),
  resultState: EditorState.createEmpty()
}

const editorReducer = (state = defaultEditor, action) => {
  let inputContent, resultContent, inputState;
  switch (action.type) {
    case UPDATE_EDITOR_STATE:
      inputState = action.payload;
      return {
        ...state, inputState,
        rawContent: convertToRaw(inputState.getCurrentContent())
      };
    case UPDATE_EDITOR:
      inputState = EditorState.createWithContent(convertFromRaw(action.payload));
      return {...state, inputState};
    case UPDATE_RESULTS:
      resultContent = ContentState.createFromText(action.payload.join('\n'));
      return {...state, 
        resultState: EditorState.createWithContent(resultContent)};
    case WRITE_EDITOR:
      inputContent = ContentState.createFromText(action.payload);
      return {
        ...state,
        inputState: EditorState.createWithContent(inputContent)
      };
    case WRITE_RESULTS:
      resultContent = ContentState.createFromText(action.payload);
      return {
        ...state,
        resultState: EditorState.createWithContent(resultContent)
      };
    case FETCHED_DOCUMENT:
      const {contents} = action.payload;
      const results = action.payload.lines.map(l => l.result_formatted);

      resultContent = ContentState.createFromText(results.join('\n'));
      inputContent = ContentState.createFromText(contents.join('\n'));

      return {
        ...state, contents, results,
        inputState: EditorState.createWithContent(inputContent),
        resultState: EditorState.createWithContent(resultContent)
      };
    default:
      return state;
  }
}

/* config */

const defaultConfig = {
  debug: false
};

const configReducer = (state = defaultConfig, action) => {
  switch (action.type) {
    case TOGGLE_DEBUG:
      return {...state, debug: !state.debug};
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  documents: documentsReducer,
  document: documentReducer,
  editor: editorReducer,
  config: configReducer
});

export default rootReducer;
