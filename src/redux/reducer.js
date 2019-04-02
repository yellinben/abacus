import { combineReducers } from "redux";
import {FETCHED_DOCUMENTS} from './types';

const documentsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCHED_DOCUMENTS:
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  documents: documentsReducer
});

export default rootReducer;