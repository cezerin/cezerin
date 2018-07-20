import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

export default class SelectShippingMethodsField extends React.Component {
	constructor(props) {
		super(props);
		const ids = Array.isArray(props.input.value) ? props.input.value : [];
		this.state = {
			selectedIds: ids
		};
	}

	componentWillReceiveProps(nextProps) {
		const newIds = Array.isArray(nextProps.input.value)
			? nextProps.input.value
			: [];
		if (newIds !== this.state.selectedIds) {
			this.setState({
				selectedIds: newIds
			});
		}
	}

	onCheckboxChecked = methodId => {
		let ids = this.state.selectedIds;
		if (ids.includes(methodId)) {
			ids = ids.filter(id => id !== methodId);
		} else {
			ids.push(methodId);
		}
		this.setState({ selectedIds: ids });
		this.props.input.onChange(ids);
	};

	isCheckboxChecked = methodId => {
		return this.state.selectedIds.includes(methodId);
	};

	render() {
		const items = this.props.shippingMethods.map(method => (
			<ListItem
				key={method.id}
				leftCheckbox={
					<Checkbox
						checked={this.isCheckboxChecked(method.id)}
						onCheck={(e, isChecked) => {
							this.onCheckboxChecked(method.id);
						}}
					/>
				}
				primaryText={method.name}
				secondaryText={method.description}
			/>
		));

		return <List>{items}</List>;
	}
}
