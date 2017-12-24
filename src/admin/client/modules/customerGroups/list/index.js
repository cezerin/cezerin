import { connect } from 'react-redux'
import { selectGroup, fetchGroupsIfNeeded } from '../actions'
import { fetchCustomers } from '../../customers/actions'
import List from '../components/list'

const mapStateToProps = (state) => {
  return {
    items: state.customerGroups.items,
    selectedId: state.customerGroups.selectedId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchGroupsIfNeeded());
    },
    onSelect: (groupId) => {
      dispatch(selectGroup(groupId));
      dispatch(fetchCustomers());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
