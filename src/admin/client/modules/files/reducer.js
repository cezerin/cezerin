import * as t from './actionTypes'

const initialState = {
  files: [],
  uploading: false
};

export default(state = initialState, action) => {
  switch (action.type) {
    case t.FILES_RECEIVE:
      return Object.assign({}, state, {files: action.files})
    case t.FILES_UPLOAD_START:
      return Object.assign({}, state, {
        uploading: true
      })
    case t.FILES_UPLOAD_END:
      return Object.assign({}, state, {
        uploading: false
      })
    default:
      return state
  }
}
