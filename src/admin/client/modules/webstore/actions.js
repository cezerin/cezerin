import * as t from './actionTypes'
import api from 'lib/api'
import messages from 'lib/text'

const receiveAccount = account => ({
  type: t.ACCOUNT_RECEIVE,
  account
})

export const fetchAccount = () => (dispatch, getState) => {
  return api.webstore.account.retrieve()
  .then(({status, json}) => {
    dispatch(receiveAccount(json))
  })
}

export const updateAccount = account => (dispatch, getState) => {
  return api.webstore.account.update(account)
  .then(({status, json}) => {
    dispatch(receiveAccount(json))
  })
}

export const updateDeveloperAccount = account => (dispatch, getState) => {
  return api.webstore.account.updateDeveloper(account)
  .then(({status, json}) => {
    dispatch(receiveAccount(json))
  })
}
