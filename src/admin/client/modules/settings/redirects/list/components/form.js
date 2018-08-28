import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

const RedirectItem = ({ redirect }) => {
	return (
		<div>
			<Divider />
			<Link
				to={`/admin/settings/redirects/${redirect.id}`}
				style={{ textDecoration: 'none' }}
			>
				<ListItem
					rightIcon={
						<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>
					}
					primaryText={
						<div className="row">
							<div className="col-xs-4">{redirect.from}</div>
							<div className="col-xs-4">{redirect.to}</div>
							<div className="col-xs-4" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
								301
							</div>
						</div>
					}
				/>
			</Link>
		</div>
	);
};

export default class RedirectsList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const { redirects } = this.props;
		let listItems = redirects.map((redirect, index) => (
			<RedirectItem key={index} redirect={redirect} />
		));

		return (
			<div>
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.redirectsAbout}
				</div>
				<Paper className="paper-box" zDepth={1}>
					<div style={{ width: '100%' }}>
						<List style={{ padding: 0 }}>{listItems}</List>
					</div>
				</Paper>
			</div>
		);
	}
}
