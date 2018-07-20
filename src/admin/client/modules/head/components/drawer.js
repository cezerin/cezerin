import React from 'react';
import { NavLink } from 'react-router-dom';
import messages from 'lib/text';

import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

const menuItems = [
	{
		title: messages.drawer_home,
		url: '/admin/',
		icon: 'home'
	},
	{
		title: messages.drawer_products,
		url: '/admin/products',
		icon: 'local_offer'
	},
	{
		title: messages.drawer_orders,
		url: '/admin/orders',
		icon: 'shopping_cart'
	},
	{
		title: messages.drawer_customers,
		url: '/admin/customers',
		icon: 'person'
	},
	{
		title: messages.settings_pages,
		url: '/admin/pages',
		icon: 'description'
	},
	{
		title: messages.files,
		url: '/admin/files',
		icon: 'folder'
	},
	{
		title: '-',
		url: 'settings'
	},
	{
		title: messages.drawer_settings,
		url: '/admin/settings',
		icon: 'settings'
	},
	{
		title: messages.apps,
		url: '/admin/apps',
		icon: 'apps'
	},
	{
		title: messages.drawer_logout,
		url: '/admin/logout',
		icon: 'exit_to_app'
	}
];

const styles = {
	link: {
		display: 'block',
		color: 'rgba(0,0,0,0.82)',
		textDecoration: 'none'
	},
	linkActive: {
		color: 'rgb(25, 118, 210)',
		backgroundColor: 'rgba(0,0,0,0.05)'
	},
	icon: {
		left: 12,
		color: 'rgba(0,0,0,0.54)'
	},
	iconActive: {
		left: 12,
		color: 'inherit'
	},
	itemInnerDiv: {
		paddingLeft: 76,
		fontSize: 14,
		fontWeight: 500,
		color: 'inherit'
	},
	item: {
		color: 'inherit'
	},
	appBar: {
		backgroundColor: '#fff',
		paddingLeft: 28
	},
	appBarTitle: {
		color: '#777',
		fontSize: 18
	},
	menu: {
		paddingTop: 0
	}
};

const DrawerMenu = ({ open, onClose, currentUrl }) => {
	const items = menuItems.map(
		(item, index) =>
			item.title === '-' ? (
				<Divider key={index} />
			) : (
				<NavLink
					to={item.url}
					key={index}
					exact={true}
					style={styles.link}
					activeStyle={styles.linkActive}
				>
					<MenuItem
						onClick={onClose}
						primaryText={item.title}
						innerDivStyle={styles.itemInnerDiv}
						style={styles.item}
						leftIcon={
							<FontIcon
								style={
									item.url === currentUrl ? styles.iconActive : styles.icon
								}
								className="material-icons"
							>
								{item.icon}
							</FontIcon>
						}
					/>
				</NavLink>
			)
	);

	return (
		<Drawer docked={false} width={280} open={open} onRequestChange={onClose}>
			<AppBar
				title={messages.drawer_title}
				style={styles.appBar}
				titleStyle={styles.appBarTitle}
				zDepth={0}
				iconElementLeft={
					<IconButton onClick={onClose}>
						<FontIcon color="#9e9e9e" className="material-icons">
							menu
						</FontIcon>
					</IconButton>
				}
			/>
			<Menu listStyle={styles.menu} disableAutoFocus={true}>
				{items}
			</Menu>
		</Drawer>
	);
};

export default DrawerMenu;
