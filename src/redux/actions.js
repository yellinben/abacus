import { isEmpty } from 'lodash'

import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  DOCUMENT_CREATED,
  DOCUMENT_DELETED,
  DOCUMENT_UPDATED,
  LINE_CREATED,
  LINE_UPDATED,
  LINE_DELETED,
  LINE_SELECTED,
  SELECT_LINE,
  SELECT_LINE_RELATIVE,
  ADD_LINE,
  TOGGLE_DEBUG,
  UPDATE_EDITOR,
} from './types'

export const apiURL = (...paths) => {
  const API = {
    host: "http://localhost",
    port: 3000,
    path: "api",
    version: 1
  }

  paths = [`${API.host}:${API.port}`, API.path, `v${API.version}`, ...paths];
  return paths.join('/');
}

export const creatingDocument = () => {
  return dispatch => {
    // console.log('creatingDocument');
    fetch(apiURL('documents'), {method: "POST"})
      .then(res => res.json())
      .then(doc => {
        // console.log('doc', doc);
        dispatch(createdDocument(doc));
      });
  }
}

export const createdDocument = (doc) => {
  return {action: DOCUMENT_CREATED, payload: doc};
}

export const fetchingDocuments = () => {
  return dispatch => {
    fetch(apiURL('documents'))
      .then(res => res.json())
      .then(docs => {
        dispatch(fetchedDocuments(docs));
      });
  };
}

export const fetchedDocuments = (documents) => {
  return {type: FETCHED_DOCUMENTS, payload: documents};
}

export const fetchingDocument = (id) => {
  return dispatch => {
    fetch(apiURL('documents', id))
      .then(res => res.json())
      .then(doc => {
        dispatch(fetchedDocument(doc));
      });
  };
}

export const fetchedDocument = (document) => {
  return {type: FETCHED_DOCUMENT, payload: document};
}

export const updatingDocument = (doc) => {
  return dispatch => {
    dispatch(updatedDocument(doc));
    fetch(apiURL('documents', doc.id), {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title: doc.title})
    });
  }
}

export const updatedDocument = (doc) => {
  return {type: DOCUMENT_UPDATED, payload: doc};
}

export const deletingDocument = (doc) => {
  return dispatch => {
    dispatch(deletedDocument(doc));
    fetch(apiURL('documents', doc.id), {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(doc)
    });
  }
}

export const deletedDocument = (doc) => {
  return {type: DOCUMENT_DELETED, payload: doc};
}

export const updateEditor = (editorState) => {
  return {type: UPDATE_EDITOR, payload: editorState};
}

// export const updateResults = (editorState) => {
//   return {type: UPDATE_RESULTS, payload: editorState};
// }

export const updatingDocumentContent = (doc, content) => {
  return dispatch => {
    fetch(apiURL('documents', doc.id), {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content})
    }).then(res => res.json())
      .then(doc => dispatch(updatedDocument(doc)))
  }
}

export const toggleDebug = () => {
  return {type: TOGGLE_DEBUG};
}