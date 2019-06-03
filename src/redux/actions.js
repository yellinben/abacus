import { Document } from 'abacus-js';

import {
  FETCHED_DOCUMENTS,
  FETCHED_DOCUMENT,
  DOCUMENT_CREATED,
  DOCUMENT_DELETED,
  DOCUMENT_UPDATED,
  TOGGLE_DEBUG,
  UPDATE_EDITOR,
  UPDATE_RESULTS,
  UPDATE_EDITOR_STATE,
  CATCH_ERROR,
  WRITE_EDITOR,
  WRITE_RESULTS,
} from './types';

const defaultDoc = new Document(
  {title: 'npm'}, [
  '1 + 4', '8 * 2.1'
]);

export const apiURL = (...paths) => {
  const API = {
    host: 'http://localhost',
    port: 3004,
    path: 'api',
    version: 1,
  };

  const url = [`${API.host}:${API.port}`, API.path, `v${API.version}`];
  if (paths && paths.length) url.push(...paths);

  return url.join('/');
};

export const creatingDocument = () => {
  return dispatch => {
    const doc = new Document();
    return dispatch(createdDocument(doc));
  };
};

export const createdDocument = doc => {
  return {action: DOCUMENT_CREATED, payload: doc};
};

export const fetchingDocuments = () => {
  return dispatch => {
    dispatch(fetchedDocuments([defaultDoc]));
  };
};

export const fetchedDocuments = documents => {
  return {type: FETCHED_DOCUMENTS, payload: documents};
};

export const fetchingDocument = id => {
  return dispatch => {
    dispatch(fetchedDocument(defaultDoc));
  };
};

export const fetchedDocument = document => {
  return {type: FETCHED_DOCUMENT, payload: document};
};

export const updatingDocument = doc => {
  return dispatch => {
    dispatch(updatedDocument(doc));
  };
};

export const updatedDocument = doc => {
  return {type: DOCUMENT_UPDATED, payload: doc};
};

export const deletingDocument = doc => {
  return dispatch => {
    dispatch(deletedDocument(doc));
  };
};

export const deletedDocument = doc => {
  return {type: DOCUMENT_DELETED, payload: doc};
};

export const updatingDocumentContent = (doc, contents) => {
  return dispatch => {
    dispatch(updatedDocument(doc));
  };
};

export const writeEditorText = text => {
  return {type: WRITE_EDITOR, payload: text};
};

export const writeResultText = text => {
  return {type: WRITE_RESULTS, payload: text};
};

export const updatingEditor = (doc, rawContent) => {
  return dispatch => {
    dispatch(updatedEditorContent(rawContent));
    const contents = rawContent.blocks.map(b => b.text);

    const newDoc = new Document({contents});
    const results = newDoc.lines.map(l => l.result_formatted);
    dispatch(updatedResults(results));
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
