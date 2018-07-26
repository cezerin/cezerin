import { connect } from 'react-redux';
import { fetchPages } from '../actions';
import Form from './components/form';

const mapStateToProps = state => {
	return {
		pages: state.pages.pages
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoad: () => {
			dispatch(fetchPages());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
