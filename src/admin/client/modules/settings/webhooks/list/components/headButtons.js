import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const Buttons = () => (
	<span>
		<Link to="/admin/settings/webhooks/add">
			<IconButton
				touch={true}
				tooltipPosition="bottom-left"
				tooltip={messages.webhookAdd}
			>
				<FontIcon color="#fff" className="material-icons">
					add
				</FontIcon>
			</IconButton>
		</Link>
	</span>
);

export default Buttons;
