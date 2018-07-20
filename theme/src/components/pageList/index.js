import React from 'react';
import api from '../../lib/api';
import PageList from './list';

export default class CustomPageList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pages: []
		};
	}

	componentDidMount() {
		this.fetchData(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.fetchData(nextProps);
	}

	fetchData = ({ tags, sort }) => {
		const filter = {
			tags: tags,
			sort: sort
		};

		api.ajax.pages.list(filter).then(({ status, json }) => {
			this.setState({
				pages: json
			});
		});
	};

	render() {
		const { pages } = this.state;
		return <PageList pages={pages} />;
	}
}
