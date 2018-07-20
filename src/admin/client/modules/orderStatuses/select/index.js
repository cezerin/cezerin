import { connect } from 'react-redux';
import { fetchStatusesIfNeeded } from '../actions';
import List from '../components/list';

const mapStateToProps = state => {
	return {
		items: state.orderStatuses.items
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoad: () => {
			dispatch(fetchStatusesIfNeeded());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(List);
