import { Notebook, Sheet } from 'abacus-js';
import Api from '../api';

import {
  FETCHED_SHEETS,
  FETCHED_SHEET,
  SHEET_CREATED,
  SHEET_DELETED,
  SHEET_UPDATED,
  TOGGLE_DEBUG,
  UPDATE_EDITOR,
  UPDATE_RESULTS,
  UPDATE_EDITOR_STATE,
  CATCH_ERROR,
  WRITE_EDITOR,
  WRITE_RESULTS,
} from './types';

const tempSheet = new Sheet({title: 'temp'});
tempSheet.add(
  '1 + 4', 
  '8 * 2.1'
);

export const creatingSheet = () => {
  return dispatch => {
    const sheet = Api.createSheet();
    return dispatch(createdSheet(sheet));
  };
};

export const createdSheet = sheet => {
  return {action: SHEET_CREATED, payload: sheet};
};

export const fetchingSheets = () => {
  return dispatch => {
    dispatch(fetchedSheets(Api.getSheets()));
  };
};

export const fetchedSheets = sheets => {
  return {type: FETCHED_SHEETS, payload: sheets};
};

export const fetchingSheet = id => {
  return dispatch => {
    const sheet = Api.getSheet(id);
    dispatch(fetchedSheet(sheet));
  };
};

export const fetchedSheet = sheet => {
  return {type: FETCHED_SHEET, payload: sheet};
};

export const updatingSheet = sheet => {
  return dispatch => {
    dispatch(updatedSheet(Api.updateSheet(sheet)));
  };
};

export const updatedSheet = sheet => {
  return {type: SHEET_UPDATED, payload: sheet};
};

export const deletingSheet = sheet => {
  return dispatch => {
    dispatch(deletedSheet(sheet));
  };
};

export const deletedSheet = sheet => {
  return {type: SHEET_DELETED, payload: sheet};
};

export const updatingSheetContent = (sheet, contents) => {
  return dispatch => {
    sheet.update(contents);
    dispatch(updatedSheet(sheet));
  };
};

export const writeEditorText = text => {
  return {type: WRITE_EDITOR, payload: text};
};

export const writeResultText = text => {
  return {type: WRITE_RESULTS, payload: text};
};

export const updatingEditor = (sheet, rawContent) => {
  return dispatch => {
    dispatch(updatedEditorContent(rawContent));
    sheet.update(rawContent.blocks.map(b => b.text));
    dispatch(updatedResults(sheet.results()));
  };
};

export const updatedEditorState = editorState => {
  return {type: UPDATE_EDITOR_STATE, payload: editorState};
};

export const updatedEditorContent = content => {
  return {type: UPDATE_EDITOR, payload: content};
};

export const updatedResults = results => {
  return {type: UPDATE_RESULTS, payload: results};
};

export const toggleDebug = () => {
  return {type: TOGGLE_DEBUG};
};

export const catchError = err => {
  return {type: CATCH_ERROR, payload: err};
};
