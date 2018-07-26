import { connect } from 'react-redux';
import { fetchGroupsIfNeeded } from '../actions';
import List from '../components/list';

const mapStateToProps = state => {
	return {
		items: state.customerGroups.items
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoad: () => {
			dispatch(fetchGroupsIfNeeded());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(List);
