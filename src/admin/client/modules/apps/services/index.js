import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchServices } from '../actions';
import * as webstoreAuth from 'lib/webstoreAuth';
import List from './components/list';

const mapStateToProps = (state, ownProps) => {
	const webstoreAuthorized = webstoreAuth.isCurrentTokenValid();
	return {
		services: state.apps.services,
		webstoreAuthorized: webstoreAuthorized
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchData: () => {
			dispatch(fetchServices());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(List)
);
