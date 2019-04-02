import { FETCHED_DOCUMENTS, FETCHED_DOCUMENT } from './types'

const API = {
  host: "http://localhost",
  port: 3000,
  path: "api",
  version: 1
}

const apiURL = (...paths) => {
  return `${API.host}:${API.port}/${API.path}/v${API.version}/${paths.join('/')}`;
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
    console.log('fetchingDocuments');
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

export {
  fetchingDocuments, fetchedDocuments,
  fetchingDocument, fetchedDocument
};