import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';

import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

const WebStoreMenu = () => {
	return (
		<IconMenu
			iconButtonElement={
				<IconButton touch={true}>
					<FontIcon color="#fff" className="material-icons">
						more_vert
					</FontIcon>
				</IconButton>
			}
			targetOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
		>
			<MenuItem
				containerElement={<Link to="/admin/apps/account" />}
				primaryText={messages.account}
			/>
		</IconMenu>
	);
};

export default WebStoreMenu;
