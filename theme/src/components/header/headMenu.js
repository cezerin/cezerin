import React from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../../lib/settings';

class HeadMenuItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isActive: false
		};
	}

	onMouseEnterHandler = () => {
		if (!this.props.isMobile && this.props.level === 1) {
			this.setState({
				isActive: true
			});
		}
	};

	onMouseLeaveHandler = () => {
		if (!this.props.isMobile && this.props.level === 1) {
			this.setState({
				isActive: false
			});
		}
	};

	isActiveToggle = () =>
		this.setState({
			isActive: !this.state.isActive
		});

	render() {
		const { categories, category, onClick, level, isMobile } = this.props;
		const items = categories
			.filter(item => item.parent_id === category.id)
			.map((subcategory, index) => (
				<HeadMenuItem
					key={index}
					category={subcategory}
					onClick={onClick}
					categories={categories}
					level={level + 1}
					isMobile={isMobile}
				/>
			));
		const hasItems = items.length > 0;

		return (
			<li
				onMouseEnter={this.onMouseEnterHandler}
				onMouseLeave={this.onMouseLeaveHandler}
				onMouseUp={this.onMouseLeaveHandler}
				className={
					(level === 2 ? 'column is-3' : '') +
					(this.state.isActive ? ' is-active' : '') +
					(hasItems ? ' has-items' : '')
				}
			>
				<div className="cat-parent">
					<NavLink
						activeClassName="is-active"
						className={hasItems ? 'has-items' : ''}
						to={category.path}
						onClick={onClick}
					>
						{category.name}
					</NavLink>
					{hasItems && isMobile && <span onClick={this.isActiveToggle} />}
				</div>
				{hasItems && (
					<ul
						className={
							(level === 1 ? 'columns is-gapless is-multiline' : '') +
							' nav-level-' +
							level
						}
					>
						{items}
					</ul>
				)}
			</li>
		);
	}
}

export default class HeadMenu extends React.PureComponent {
	render() {
		const { categories, onClick, isMobile } = this.props;
		let addItemsToMenu = [];
		if (themeSettings.header_menu && themeSettings.header_menu.length > 0) {
			addItemsToMenu = themeSettings.header_menu.map(item => ({
				name: item.text,
				path: item.url,
				id: item.id || '',
				parent_id: item.parent_id || null
			}));
		}
		const menuItems = [...categories, ...addItemsToMenu];

		const items = menuItems
			.filter(category => category.parent_id === null)
			.map((category, index) => (
				<HeadMenuItem
					key={index}
					category={category}
					onClick={onClick}
					categories={categories}
					level={1}
					isMobile={isMobile}
				/>
			));

		return <ul className="nav-level-0">{items}</ul>;
	}
}
