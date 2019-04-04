import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  UPDATE_DOCUMENT,
  LINE_UPDATED,
  ADD_LINE
} from './types'

const apiURL = (...paths) => {
  const API = {
    host: "http://localhost",
    port: 3000,
    path: "api",
    version: 1
  }

  paths = [`${API.host}:${API.port}`, API.path, `v${API.version}`, ...paths];
  return paths.join('/');
}

const fetchingDocuments = () => {
  return dispatch => {
    fetch(apiURL('documents'))
      .then(res => res.json())
      .then(docs => {
        dispatch(fetchedDocuments(docs));
      })
  };
}

const fetchedDocuments = (documents) => {
  return {type: FETCHED_DOCUMENTS, payload: documents};
}

const fetchingDocument = (id) => {
  return dispatch => {
    fetch(apiURL('documents', id))
      .then(res => res.json())
      .then(doc => {
        dispatch(fetchedDocument(doc));
      })
  };
}

const fetchedDocument = (document) => {
  return {type: FETCHED_DOCUMENT, payload: document};
}

const updatingLine = (docId, line) => {
  return dispatch => {
    console.log('updatingLog', docId, line);
    fetch(apiURL('documents', docId, 'lines', line.id), {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(line)
    })
      .then(res => res.json())
      .then(line => dispatch(updatedLine(line)));
  }
}

const updatedLine = (line) => {
  console.log('updatedLog', line);
  return {type: LINE_UPDATED, payload: line};
}

const addLine = () => {
  return {type: ADD_LINE}
}

const updateDocument = (doc) => {
  return dispatch => {
    console.log('updateDoc', doc);
    fetch(apiURL('documents', doc.id), {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(doc)
    }).then(res => res.json())
  }
}

// const updateTitle = (doc) => {
//   return {type: UPDATE_TITLE, payload: doc}
// }

export {
  fetchingDocuments, fetchedDocuments,
  fetchingDocument, fetchedDocument, updateDocument,
  updatingLine, updatedLine, addLine
};