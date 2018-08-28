import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteRedirect } from '../../actions';
import Buttons from './components/headButtons';

const mapStateToProps = (state, ownProps) => {
	return {
		redirect: state.settings.redirectEdit
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: redirectId => {
			dispatch(deleteRedirect(redirectId));
			ownProps.history.push('/admin/settings/redirects');
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
