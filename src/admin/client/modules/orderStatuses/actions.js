import * as t from './actionTypes'
import api from 'lib/api'
import messages from 'lib/text'

function requestStatuses() {
  return {
    type: t.STATUSES_REQUEST
  }
}

function receiveStatuses(items) {
  return {
    type: t.STATUSES_RECEIVE,
    items
  }
}

function receiveErrorStatuses(error) {
  return {
    type: t.STATUSES_FAILURE,
    error
  }
}

export function selectStatus(id) {
  return {
    type: t.STATUSES_SELECT,
    selectedId: id
  }
}

export function deselectStatus() {
  return {
    type: t.STATUSES_DESELECT
  }
}

function requestUpdateStatus(id) {
  return {
    type: t.STATUS_UPDATE_REQUEST
  }
}

function receiveUpdateStatus() {
  return {
    type: t.STATUS_UPDATE_SUCCESS
  }
}

function errorUpdateStatus(error) {
  return {
    type: t.STATUS_UPDATE_FAILURE,
    error
  }
}

function successCreateStatus(id) {
  return {
    type: t.STATUS_CREATE_SUCCESS
  }
}

function successDeleteStatus(id) {
  return {
    type: t.STATUS_DELETE_SUCCESS
  }
}

function fetchStatuses() {
  return dispatch => {
    dispatch(requestStatuses());
    return api.orderStatuses.list()
      .then(({status, json}) => {
        json = json.sort((a,b) => (a.position - b.position ));

        json.forEach((element, index, theArray) => {
          if(theArray[index].name === '') {
            theArray[index].name = `<${messages.draft}>`;
          }
        })

        dispatch(receiveStatuses(json))
      })
      .catch(error => {
          dispatch(receiveErrorStatuses(error));
      });
  }
}

function shouldFetchStatuses(state) {
  const statuses = state.orderStatuses
  if (statuses.isFetched || statuses.isFetching) {
    return false
  } else {
    return true
  }
}

export function fetchStatusesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchStatuses(getState())) {
      return dispatch(fetchStatuses())
    }
  }
}

export function updateStatus(data) {
  return (dispatch, getState) => {
    dispatch(requestUpdateStatus(data.id));
    return api.orderStatuses.update(data.id, data)
      .then(({status, json}) => {
          dispatch(receiveUpdateStatus());
          dispatch(fetchStatuses());
      })
      .catch(error => {
          dispatch(errorUpdateStatus(error));
      });
  }
}

export function createStatus(data) {
  return (dispatch, getState) => {
    return api.orderStatuses.create(data)
      .then(({status, json}) => {
          dispatch(successCreateStatus(json.id));
          dispatch(fetchStatuses());
          dispatch(selectStatus(json.id));
      })
      .catch(error => {
          //dispatch error
          console.log(error)
      });
  }
}

export function deleteStatus(id) {
  return (dispatch, getState) => {
    return api.orderStatuses.delete(id)
      .then(({status, json}) => {
        if(status === 200) {
          dispatch(successDeleteStatus(id));
          dispatch(deselectStatus());
          dispatch(fetchStatuses());
        } else {
          throw status
        }
      })
      .catch(error => {
          //dispatch error
          console.log(error)
      });
  }
}
