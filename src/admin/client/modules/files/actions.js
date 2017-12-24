import * as t from './actionTypes'
import api from 'lib/api'
import messages from 'lib/text'

function receiveFiles(files) {
  return {
    type: t.FILES_RECEIVE,
    files
  }
}

function filesUploadStart() {
  return {
    type: t.FILES_UPLOAD_START
  }
}

function filesUploadEnd() {
  return {
    type: t.FILES_UPLOAD_END
  }
}

export function fetchFiles() {
  return (dispatch, getState) => {
    return api.files.list().then(({status, json}) => {
      dispatch(receiveFiles(json))
    }).catch(error => {});
  }
}

export function uploadFiles(form) {
  return (dispatch, getState) => {
    dispatch(filesUploadStart());
    return api.files.upload(form).then(() => {
      dispatch(filesUploadEnd());
      dispatch(fetchFiles())
    }).catch(error => {
      dispatch(filesUploadEnd());
    });
  }
}

export function deleteFile(fileName) {
  return (dispatch, getState) => {
    return api.files.delete(fileName).then(() => {
      dispatch(fetchFiles())
    }).catch(error => {});
  }
}
