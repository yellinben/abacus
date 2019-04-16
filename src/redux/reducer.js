import { combineReducers } from 'redux';
import { EditorState, ContentState } from 'draft-js';

import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  DOCUMENT_CREATED,
  DOCUMENT_UPDATED,
  DOCUMENT_DELETED,
  UPDATE_EDITOR,
  UPDATE_RESULTS,
  TOGGLE_DEBUG
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

// const defaultContentState = EditorState.createEmpty();
// const defaultResultsState = EditorState.createEmpty();

const defaultEditor = {
  contents: [],
  results: [],
  editorState: EditorState.createEmpty()
}

const editorReducer = (state = defaultEditor, action) => {
  switch (action.type) {
    case UPDATE_EDITOR:
      return {
        ...state,
        editorState: action.payload
      };
    case FETCHED_DOCUMENT:
      const {contents,results} = action.payload;
      return {
        ...state,
        contents,
        results
      };
    default:
      return state;
  }
}

/* results */

const defaultResultsState = EditorState.createEmpty();

const resultsReducer = (state = defaultResultsState, action) => {
  switch (action.type) {
    case UPDATE_RESULTS:
      return action.payload;
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