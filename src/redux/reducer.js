import { combineReducers } from "redux";

import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  DOCUMENT_CREATED,
  DOCUMENT_UPDATED,
  DOCUMENT_DELETED,
  LINE_UPDATED,
  LINE_CREATED,
  ADD_LINE,
  LINE_DELETED
} from './types';

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

const defaultDoc = {lines: []};
const defaultLine = {input: ''};

const documentReducer = (state = defaultDoc, action) => {
  switch (action.type) {
    case FETCHED_DOCUMENT:
      return action.payload;
    case LINE_UPDATED:
      return {
        ...state,
        lines: state.lines.map(l => {
          return (l.id === action.payload.id) ? 
          action.payload : l
        })
      };
    case LINE_DELETED:
      return {
        ...state,
        lines: state.lines.filter(l => {
          return l.id !== action.payload.id;
        })
      };
    case LINE_CREATED:
      // line creation should only happen on newly-added last line of doc
      // replace id-less last line with full object
      return {
        ...state,
        lines: [
          ...state.lines.slice(0, state.lines.length-1),
          action.payload
        ]
      };
    case ADD_LINE:
      return {
        ...state,
        lines: [
          ...state.lines, 
          {...defaultLine, document_id: state.id}
        ]
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  documents: documentsReducer,
  document: documentReducer
});

export default rootReducer;