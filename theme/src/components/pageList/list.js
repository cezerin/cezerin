import React from 'react';
import { themeSettings, text } from '../../lib/settings';
import PageListItem from './item';

const PageList = ({ pages }) => {
	const items = pages
		? pages.map((page, index) => <PageListItem key={index} page={page} />)
		: null;

	return <div className="page-list">{items}</div>;
};

export default PageList;
