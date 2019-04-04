import { combineReducers } from "redux";

import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  LINE_UPDATED,
  ADD_LINE
} from './types';

const documentsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCHED_DOCUMENTS:
      return action.payload;
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
    case ADD_LINE:
      return {
        ...state,
        lines: [
          ...state.lines, 
          defaultLine
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