import React from 'react';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Head from './head';
import ProductsListItem from './item';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import messages from 'lib/text';
import style from './style.css';

export default class ProductsList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const {
			items,
			selected,
			loadingItems,
			onSelect,
			onSelectAll,
			selectedAll,
			loadMore,
			settings,
			hasMore,
			totalCount
		} = this.props;

		const rows = items.map((item, index) => {
			const itemSelected = selected.includes(item.id);
			return (
				<ProductsListItem
					key={index}
					product={item}
					selected={itemSelected}
					onSelect={onSelect}
					settings={settings}
				/>
			);
		});

		return (
			<div>
				<List>
					<Head onSelectAll={onSelectAll} />
					<Divider />
					{rows}
					<div className={style.more}>
						<RaisedButton
							disabled={loadingItems || !hasMore}
							label={messages.actions_loadMore}
							labelPosition="before"
							primary={false}
							icon={<FontIcon className="material-icons">refresh</FontIcon>}
							onClick={loadMore}
						/>
					</div>
				</List>
			</div>
		);
	}
}
