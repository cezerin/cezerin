import React from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../../lib/settings';

const pad = number => (number < 10 ? '0' + number : number);
const formatDate = date =>
	`${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;

const PageListItem = ({ page }) => (
	<div className="page-item">
		<h2>
			<NavLink to={page.path}>{page.meta_title}</NavLink>
		</h2>
		<div className="date">{formatDate(new Date(page.date_created))}</div>
		<div className="description">{page.meta_description}</div>
	</div>
);

export default PageListItem;
