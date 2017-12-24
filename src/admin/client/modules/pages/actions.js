import * as t from './actionTypes'
import api from 'lib/api'
import messages from 'lib/text'

function receivePages(pages) {
  return {
    type: t.PAGES_RECEIVE,
    pages
  }
}

export function receivePage(pageEdit) {
  return {
    type: t.PAGE_RECEIVE,
    pageEdit
  }
}

export function fetchPages() {
  return (dispatch, getState) => {
    return api.pages.list().then(({status, json}) => {
      dispatch(receivePages(json))
    }).catch(error => {});
  }
}

export function fetchPage(id) {
  return (dispatch, getState) => {
    return api.pages.retrieve(id).then(({status, json}) => {
      dispatch(receivePage(json))
    }).catch(error => {});
  }
}

export function createPage(page) {
  return (dispatch, getState) => {
    return api.pages.create(page).then(({status, json}) => {
      dispatch(fetchPages())
    }).catch(error => {});
  }
}

export function updatePage(page) {
  return (dispatch, getState) => {
    return api.pages.update(page.id, page).then(({status, json}) => {
      dispatch(receivePage(json))
    }).catch(error => {});
  }
}

export function deletePage(pageId) {
  return (dispatch, getState) => {
    return api.pages.delete(pageId).then(({status, json}) => {
      dispatch(fetchPages())
    }).catch(error => {});
  }
}
