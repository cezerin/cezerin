import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import messages from 'lib/text';
import api from 'lib/api';
import style from './style.css';
import Paper from 'material-ui/Paper';

const ServiceLogs = ({ logs }) => {
	const list = logs.map((action, index) => {
		const date = moment(action.date);
		const dateFormated = date.fromNow();
		return (
			<div className={style.logsItem} key={index}>
				<div className={style.logMessage}>{action.message}</div>
				<div className={style.logDate}>{dateFormated}</div>
			</div>
		);
	});

	return (
		<div style={{ maxWidth: 720, width: '100%' }}>
			<div className="gray-title" style={{ margin: '0px 0px 0px 20px' }}>
				{messages.serviceLogs}
			</div>
			<Paper className="paper-box" zDepth={1}>
				<div className={style.logsBox}>{list}</div>
			</Paper>
		</div>
	);
};

export default ServiceLogs;
