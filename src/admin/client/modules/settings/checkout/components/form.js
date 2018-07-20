import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

const CheckoutFieldItem = ({ name, status, path }) => {
	return (
		<div>
			<Divider />
			<Link
				to={`/admin/settings/checkout/fields/${path}`}
				style={{ textDecoration: 'none' }}
			>
				<ListItem
					rightIcon={
						<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>
					}
					primaryText={
						<div className="row">
							<div className="col-xs-6">{name}</div>
							<div className="col-xs-6" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
								{status}
							</div>
						</div>
					}
				/>
			</Link>
		</div>
	);
};

export default class EmailSettings extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	getFieldStatus = fieldName => {
		const fields = this.props.checkoutFields || [];
		const field = fields.find(item => item.name === fieldName);
		const fieldStatus = field ? field.status : 'required';
		switch (fieldStatus) {
			case 'optional':
				return messages.settings_fieldOptional;
				break;
			case 'hidden':
				return messages.settings_fieldHidden;
				break;
			default:
				return messages.settings_fieldRequired;
		}
	};

	render() {
		const { checkoutFields } = this.props;

		return (
			<div>
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.settings_checkoutFields}
				</div>
				<Paper className="paper-box" zDepth={1}>
					<div style={{ width: '100%' }}>
						<List style={{ padding: 0 }}>
							<CheckoutFieldItem
								name={messages.email}
								status={this.getFieldStatus('email')}
								path="email"
							/>
							<CheckoutFieldItem
								name={messages.mobile}
								status={this.getFieldStatus('mobile')}
								path="mobile"
							/>
							<CheckoutFieldItem
								name={messages.country}
								status={this.getFieldStatus('country')}
								path="country"
							/>
							<CheckoutFieldItem
								name={messages.state}
								status={this.getFieldStatus('state')}
								path="state"
							/>
							<CheckoutFieldItem
								name={messages.city}
								status={this.getFieldStatus('city')}
								path="city"
							/>
							<CheckoutFieldItem
								name={messages.customerComment}
								status={this.getFieldStatus('comments')}
								path="comments"
							/>
						</List>
					</div>
				</Paper>
			</div>
		);
	}
}
