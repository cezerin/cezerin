import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { deletePage } from '../../actions'
import Buttons from './components/headButtons'

const mapStateToProps = (state) => {
  return {
    page: state.settings.pageEdit
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDelete: (id) => {
      dispatch(deletePage(id));
      dispatch(push('/admin/settings/pages'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
