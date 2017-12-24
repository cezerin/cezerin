import { connect } from 'react-redux'
import { fetchPage, updatePage, createPage, receivePage } from '../actions'
import Form from './components/form'

const mapStateToProps = (state, ownProps) => {
  const {pageId} = ownProps.match.params;
  return {
    pageId: pageId,
    initialValues: state.pages.pageEdit
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLoad: () => {
      const {pageId} = ownProps.match.params;
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
        ownProps.history.push('/admin/pages');
      }
    },
    eraseData: () => {
      dispatch(receivePage(null));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
