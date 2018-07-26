import { connect } from 'react-redux';
import { fetchWebhooks } from '../../actions';
import Form from './components/form';

const mapStateToProps = state => {
	return {
		webhooks: state.settings.webhooks
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoad: () => {
			dispatch(fetchWebhooks());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
