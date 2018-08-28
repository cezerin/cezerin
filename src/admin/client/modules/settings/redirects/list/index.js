import { connect } from 'react-redux';
import { fetchRedirects } from '../../actions';
import Form from './components/form';

const mapStateToProps = state => {
	return {
		redirects: state.settings.redirects
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoad: () => {
			dispatch(fetchRedirects());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
