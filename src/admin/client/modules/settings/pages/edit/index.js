import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchPage, updatePage, createPage, receivePage } from '../../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.settings.pageEdit
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (pageId) => {
      if(pageId) {
        dispatch(fetchPage(pageId))
      } else {
        dispatch(receivePage({ enabled: true }));
      }
    },
    onSubmit: (page) => {
      if(page.id) {
        dispatch(updatePage(page));
      } else {
        dispatch(createPage(page));
        dispatch(push('/admin/settings/pages'));
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
