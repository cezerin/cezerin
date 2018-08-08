import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { text } from '../lib/settings';
import * as helper from '../lib/helper';

const CategoryBreadcrumbs = ({ currentCategory, categories }) => {
	const items = helper.getCategoryBreadcrumbs(currentCategory.id, categories);
	return (
		<nav className="breadcrumb is-small" aria-label="breadcrumbs">
			<ul>
				<li>
					<NavLink to="/">{text.home}</NavLink>
				</li>
				{items}
				<li className="is-active">
					<a href={currentCategory.path} aria-current="page">
						{currentCategory.name}
					</a>
				</li>
			</ul>
		</nav>
	);
};

CategoryBreadcrumbs.propTypes = {
	currentCategory: PropTypes.shape({}).isRequired,
	categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default CategoryBreadcrumbs;
