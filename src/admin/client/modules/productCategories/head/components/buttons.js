import React from 'react';
import messages from 'lib/text';
import CategorySelect from 'modules/productCategories/select';
import DeleteConfirmation from 'modules/shared/deleteConfirmation';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
const Fragment = React.Fragment;

export default class Buttons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoryIdMoveTo: 'root',
			openMoveTo: false,
			openDelete: false
		};
	}

	showMoveTo = () => {
		this.setState({ openMoveTo: true });
	};

	showDelete = () => {
		this.setState({ openDelete: true });
	};

	closeMoveTo = () => {
		this.setState({ openMoveTo: false });
	};

	closeDelete = () => {
		this.setState({ openDelete: false });
	};

	deleteCategory = () => {
		this.setState({ openDelete: false });
		this.props.onDelete(this.props.selected.id);
	};

	saveMoveTo = () => {
		this.setState({ openMoveTo: false });
		this.props.onMoveTo(this.state.categoryIdMoveTo);
	};

	selectMoveTo = categoryId => {
		this.setState({ categoryIdMoveTo: categoryId });
	};

	render() {
		const { selected, onMoveUp, onMoveDown, onDelete, onCreate } = this.props;
		const categoryName =
			selected && selected.name && selected.name.length > 0
				? selected.name
				: 'Draft';

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
			<span>
				{selected && (
					<Fragment>
						<IconButton
							touch={true}
							tooltipPosition="bottom-left"
							tooltip={messages.actions_moveUp}
							onClick={onMoveUp}
						>
							<FontIcon color="#fff" className="material-icons">
								arrow_upward
							</FontIcon>
						</IconButton>
						<IconButton
							touch={true}
							tooltipPosition="bottom-left"
							tooltip={messages.actions_moveDown}
							onClick={onMoveDown}
						>
							<FontIcon color="#fff" className="material-icons">
								arrow_downward
							</FontIcon>
						</IconButton>
						<IconButton
							touch={true}
							tooltipPosition="bottom-left"
							tooltip={messages.actions_delete}
							onClick={this.showDelete}
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
								showRoot={true}
								showAll={false}
							/>
						</Dialog>
						<DeleteConfirmation
							open={this.state.openDelete}
							isSingle={true}
							itemsCount={1}
							itemName={categoryName}
							onCancel={this.closeDelete}
							onDelete={this.deleteCategory}
						/>
					</Fragment>
				)}
				<IconButton
					touch={true}
					tooltipPosition="bottom-left"
					tooltip={messages.productCategories_titleAdd}
					onClick={onCreate}
				>
					<FontIcon color="#fff" className="material-icons">
						add
					</FontIcon>
				</IconButton>
			</span>
		);
	}
}
