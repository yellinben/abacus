import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  UPDATED_DOCUMENT,
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

const updatingLine = (line) => {
  return dispatch => {
    fetch(apiURL('documents', line.document_id, 'lines', line.id), {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(line)
    })
      .then(res => res.json())
      .then(line => dispatch(updatedLine(line)));
  }
}

const updatedLine = (line) => {
  return {type: LINE_UPDATED, payload: line};
}

const addLine = () => {
  return {type: ADD_LINE}
}

const updatingDocument = (doc) => {
  return dispatch => {
    fetch(apiURL('documents', doc.id), {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(doc)
    })
      .then(res => res.json())
      .then(doc => dispatch(updatedDocument(doc)))
  }
}

const updatedDocument = (doc) => {
  return {type: UPDATED_DOCUMENT, payload: doc};
}

export {
  fetchingDocuments, fetchedDocuments,
  fetchingDocument, fetchedDocument, 
  updatingDocument, updatedDocument,
  updatingLine, updatedLine, addLine
};