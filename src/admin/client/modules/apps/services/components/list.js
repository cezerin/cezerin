import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import ServiceItem from './serviceItem';
import AppItem from './appItem';
import style from './style.css';
import apps from 'src/apps';
import RaisedButton from 'material-ui/RaisedButton';

export default class ServicesList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.fetchData();
	}

	render() {
		const { services, webstoreAuthorized } = this.props;

		let serviceItems = null;
		if (services && services.data) {
			serviceItems = services.data.map((service, index) => (
				<ServiceItem key={index} service={service} />
			));
		}

		const appItems = apps.map((app, index) => (
			<AppItem key={index} app={app.Description} />
		));

		return (
			<div
				className="row row--no-gutter scroll col-full-height"
				style={{ padding: 20, alignContent: 'flex-start' }}
			>
				{appItems}
				{!webstoreAuthorized && (
					<div
						style={{
							width: '100%',
							marginTop: 30,
							color: 'rgba(0, 0, 0, 0.52)'
						}}
					>
						{messages.loadFromWebstore}&nbsp;&nbsp;<Link to="/admin/apps/login">
							<RaisedButton label={messages.loginTitle} />
						</Link>
					</div>
				)}
				{serviceItems}
			</div>
		);
	}
}
