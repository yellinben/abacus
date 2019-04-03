import { combineReducers } from "redux";
import { FETCHED_DOCUMENTS, FETCHED_DOCUMENT } from './types';

const documentsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCHED_DOCUMENTS:
      return action.payload;
    default:
      return state;
  }
}

const defaultDoc = {
  lines: []
}

const documentReducer = (state = defaultDoc, action) => {
  switch (action.type) {
    case FETCHED_DOCUMENT:
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  documents: documentsReducer,
  document: documentReducer
});

export default rootReducer;