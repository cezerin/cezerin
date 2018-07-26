import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

export default class EmailSettings extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const { emailSettings } = this.props;
		const smtpHint =
			emailSettings && emailSettings.host && emailSettings.host.length > 0
				? emailSettings.host
				: 'none';

		return (
			<div>
				<Paper className="paper-box" zDepth={1}>
					<div style={{ width: '100%' }}>
						<List style={{ padding: 0 }}>
							<Link
								to="/admin/settings/email/smtp"
								style={{ textDecoration: 'none' }}
							>
								<ListItem
									rightIcon={
										<FontIcon className="material-icons">
											keyboard_arrow_right
										</FontIcon>
									}
									primaryText={
										<div className="row">
											<div className="col-xs-6">
												{messages.settings_smtpSettings}
											</div>
											<div
												className="col-xs-6"
												style={{ color: 'rgba(0, 0, 0, 0.4)' }}
											>
												{smtpHint}
											</div>
										</div>
									}
								/>
							</Link>
						</List>
					</div>
				</Paper>
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.settings_emailTemplates}
				</div>
				<Paper className="paper-box" zDepth={1}>
					<div style={{ width: '100%' }}>
						<List style={{ padding: 0 }}>
							<Link
								to="/admin/settings/email/templates/order_confirmation"
								style={{ textDecoration: 'none' }}
							>
								<ListItem
									rightIcon={
										<FontIcon className="material-icons">
											keyboard_arrow_right
										</FontIcon>
									}
									primaryText={messages.settings_orderConfirmation}
								/>
							</Link>
							{/* <ListItem
                  rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
                  primaryText={messages.settings_customerRegistration}
                  onClick={() => { pushUrl('/admin/settings/email/templates/customer_registration') }}
                />
                <Divider />
                <ListItem
                  rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
                  primaryText={messages.settings_customerRecovery}
                  onClick={() => { pushUrl('/admin/settings/email/templates/customer_recovery') }}
                />
                <Divider /> */}
						</List>
					</div>
				</Paper>
			</div>
		);
	}
}
