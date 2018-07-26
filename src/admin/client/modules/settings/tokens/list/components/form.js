import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

const TokenItem = ({ token }) => {
	return (
		<div>
			<Divider />
			<Link
				to={`/admin/settings/tokens/${token.id}`}
				style={{ textDecoration: 'none' }}
			>
				<ListItem
					rightIcon={
						<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>
					}
					primaryText={
						<div className="row">
							<div className="col-xs-6">{token.name}</div>
							<div className="col-xs-6" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
								{token.email}
							</div>
						</div>
					}
				/>
			</Link>
		</div>
	);
};

export default class TokensList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const { tokens } = this.props;
		let listItems = tokens.map((token, index) => (
			<TokenItem key={index} token={token} />
		));

		return (
			<div>
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.settings_tokenHelp}
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
