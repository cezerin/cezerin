import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import CategorySelect from 'modules/productCategories/select';
import DeleteConfirmation from 'modules/shared/deleteConfirmation';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Search from './search';
const Fragment = React.Fragment;

export default class Buttons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoryIdMoveTo: null,
			openMoveTo: false,
			openDelete: false
		};
	}

	showMoveTo = () => {
		this.setState({ openMoveTo: true });
	};

	openDelete = () => {
		this.setState({ openDelete: true });
	};

	closeDelete = () => {
		this.setState({ openDelete: false });
	};

	deleteProduct = () => {
		this.setState({ openDelete: false });
		this.props.onDelete();
	};

	closeMoveTo = () => {
		this.setState({ openMoveTo: false });
	};

	saveMoveTo = () => {
		this.setState({ openMoveTo: false });
		this.props.onMoveTo(this.state.categoryIdMoveTo);
	};

	selectMoveTo = categoryId => {
		this.setState({ categoryIdMoveTo: categoryId });
	};

	render() {
		const { search, setSearch, selectedCount, onDelete, onCreate } = this.props;

		const actionsMoveTo = [
			<FlatButton
				label={messages.cancel}
				onClick={this.closeMoveTo}
				style={{ marginRight: 10 }}
			/>,
			<FlatButton
				label={messages.actions_moveHere}
				primary={true}
				keyboardFocused={true}
				onClick={this.saveMoveTo}
			/>
		];

		return (
			<Fragment>
				<Search value={search} setSearch={setSearch} />
				{selectedCount > 0 && (
					<Fragment>
						<IconButton
							touch={true}
							tooltipPosition="bottom-left"
							tooltip={messages.actions_delete}
							onClick={this.openDelete}
						>
							<FontIcon color="#fff" className="material-icons">
								delete
							</FontIcon>
						</IconButton>
						<IconButton
							touch={true}
							tooltipPosition="bottom-left"
							tooltip={messages.actions_moveTo}
							onClick={this.showMoveTo}
						>
							<FontIcon color="#fff" className="material-icons">
								folder
							</FontIcon>
						</IconButton>
						<DeleteConfirmation
							open={this.state.openDelete}
							isSingle={false}
							itemsCount={selectedCount}
							onCancel={this.closeDelete}
							onDelete={this.deleteProduct}
						/>
						<Dialog
							title={messages.actions_moveTo}
							actions={actionsMoveTo}
							modal={false}
							open={this.state.openMoveTo}
							onRequestClose={this.closeMoveTo}
							autoScrollBodyContent={true}
						>
							<CategorySelect
								onSelect={this.selectMoveTo}
								selectedId={this.state.categoryIdMoveTo}
								opened={true}
							/>
						</Dialog>
					</Fragment>
				)}
				<IconButton
					touch={true}
					tooltipPosition="bottom-left"
					tooltip={messages.addProduct}
					onClick={onCreate}
				>
					<FontIcon color="#fff" className="material-icons">
						add
					</FontIcon>
				</IconButton>
			</Fragment>
		);
	}
}
