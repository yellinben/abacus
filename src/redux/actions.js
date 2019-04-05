import { 
  FETCHED_DOCUMENTS, 
  FETCHED_DOCUMENT, 
  UPDATED_DOCUMENT,
  LINE_UPDATED,
  LINE_CREATED,
  LINE_DELETED,
  ADD_LINE,
  DELETE_LINE,
  SELECT_LINE
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

export const fetchingDocuments = () => {
  return dispatch => {
    fetch(apiURL('documents'))
      .then(res => res.json())
      .then(docs => {
        dispatch(fetchedDocuments(docs));
      })
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
      })
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
      body: JSON.stringify(doc)
    });
  }
}

export const updatedDocument = (doc) => {
  return {type: UPDATED_DOCUMENT, payload: doc};
}

export const updatingLine = (line) => {
  // if the id is nil or 'new'
  // then it does not exist in db yet
  if (!line.id || line.id === 'new') 
    return creatingLine(line);

  // if input text is now empty
  // we can delete the line

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

export const creatingLine = (line) => {
  return dispatch => {
    fetch(apiURL('documents', line.document_id, 'lines'), {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(line)
    })
      .then(res => res.json())
      .then(line => dispatch(createdLine(line)));
  }
}

export const deletingLine = (line) => {
  return dispatch => {
    fetch(apiURL('documents', line.document_id, 'lines', line.id), {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
    })
      .then(res => res.json())
      .then(line => dispatch(deletedLine(line)));
  }
}

export const updatedLine = (line) => {
  return {type: LINE_UPDATED, payload: line};
}

export const createdLine = (line) => {
  return {type: LINE_CREATED, payload: line};
}

export const deletedLine = (line) => {
  return {type: LINE_DELETED, payload: line};
}

export const addLine = () => {
  return {type: ADD_LINE};
}

export const deleteLine = (line) => {
  return {type: DELETE_LINE, payload: line};
}

export const selectLine = (line) => {
  return {type: SELECT_LINE, payload: line};
}