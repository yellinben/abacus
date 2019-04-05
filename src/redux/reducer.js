import { combineReducers } from "redux";

import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  UPDATED_DOCUMENT,
  LINE_UPDATED,
  LINE_CREATED,
  ADD_LINE
} from './types';

const documentsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCHED_DOCUMENTS:
      return action.payload;
    case UPDATED_DOCUMENT:
      const doc = action.payload
      return state.map(d => {
        return (d.id === doc.id) ? doc : d;
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
      const line = action.payload;
      return {
        ...state,
        lines: state.lines.map(l => {
          return (l.id === line.id) ? line : l
        })
      };
    case LINE_CREATED:
      // line creation should only happen on newly-added last line of doc
      // replace id-less last line with full object
      return {
        ...state,
        lines: [
          ...state.lines.slice(0,state.lines.length-1),
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