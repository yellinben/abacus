import { combineReducers } from 'redux';

import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  DOCUMENT_CREATED,
  DOCUMENT_UPDATED,
  DOCUMENT_DELETED,
  LINE_UPDATED,
  LINE_CREATED,
  LINE_SELECTED,
  LINE_DELETED,
  ADD_LINE,
  SELECT_LINE,
  SELECT_LINE_RELATIVE,
  TOGGLE_DEBUG
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
  let index;

  switch (action.type) {
    case FETCHED_DOCUMENT:
      return {...action.payload, 
        selectedLineIndex: 0};
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
    // case LINE_SELECTED:
    //   index = state.lines.indexOf(action.payload);
      
    //   if (index < 0)
    //     index = state.lines.length-1;
    //   else if (index >= state.lines.length)
    //     index = 0

    //   return {...state, selectedLineIndex: index};
    case SELECT_LINE_RELATIVE:
      // console.log(state.selectedLineIndex)
      // index = (state.selectedLineIndex || 0) + action.payload;
      // console.log('index1', index)

      const {currentIndex, relativeIndex} = action.payload
      index = currentIndex + relativeIndex;

      if (index < 0)
        index = state.lines.length-1;
      else if (index >= state.lines.length)
        index = 0

      return {...state, selectedLineIndex: index};
    default:
      return state;
  }
}

// const defaultLine = {
//   id: nil,
// }

// const lineReducer = (state = {}, action) => {
//   switch (action.type) {
//     case LINE_SELECTED:
//       return action.payload;
//     // case SELECT_LINE_RELATIVE:
//     //   return 
//   }
// }

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
  config: configReducer
});

export default rootReducer;