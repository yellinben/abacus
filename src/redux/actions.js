import {FETCHED_DOCUMENTS} from './types'

const API = {
  host: "http://localhost",
  port: 3000,
  path: "api",
  version: 1
}

const apiURL = (endpoint) => {
  return `${API.host}:${API.port}/${API.path}/v${API.version}/${endpoint}`;
}

const fetchingDocuments = () => {
  return dispatch => {
    console.log('fetchingDocuments');
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

export {fetchingDocuments, fetchedDocuments};