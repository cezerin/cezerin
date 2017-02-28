import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchToken, updateToken, createToken, receiveToken, deleteToken } from '../../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.settings.tokenEdit,
    newToken: state.settings.newToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (tokenId) => {
      if(tokenId) {
        dispatch(fetchToken(tokenId))
      } else {
        dispatch(receiveToken({ expiration: 24 }));
      }
    },
    onSubmit: (token) => {
      if(token.id) {
        dispatch(updateToken(token));
      } else {
        dispatch(createToken(token));
      }
    },
    onDelete: (id) => {
      dispatch(deleteToken(id));
      dispatch(push('/admin/settings/tokens'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
