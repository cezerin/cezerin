import React from 'react';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { List, ListItem } from 'material-ui/List';

export const CustomToggle = ({
	input,
	label,
	className = '',
	disabled = false,
	style
}) => {
	return (
		<Toggle
			label={label}
			toggled={input.value ? true : false}
			onToggle={(event, isInputChecked) => {
				input.onChange(isInputChecked);
			}}
			className={className}
			disabled={disabled}
			style={style}
		/>
	);
};

export const NumberField = ({
	input,
	label,
	className = '',
	disabled = false,
	style
}) => (
	<TextField
		floatingLabelText={label}
		fullWidth={true}
		disabled={disabled}
		value={input.value}
		type="number"
		onChange={(event, value) => {
			let number = parseFloat(value);
			number = number ? number : 0;
			input.onChange(number);
		}}
	/>
);

export const ColorField = ({ input, meta: { touched, error } }) => (
	<input {...input} type="color" />
);

export class MultiSelect extends React.Component {
	constructor(props) {
		super(props);
		const values = Array.isArray(props.input.value) ? props.input.value : [];
		this.state = {
			selectedItems: values
		};
	}

	componentWillReceiveProps(nextProps) {
		const values = Array.isArray(nextProps.input.value)
			? nextProps.input.value
			: [];
		if (values !== this.state.selectedItems) {
			this.setState({
				selectedItems: values
			});
		}
	}

	onCheckboxChecked = item => {
		const { selectedItems } = this.state;
		let newSelectedItems = [];
		if (selectedItems.includes(item)) {
			newSelectedItems = selectedItems.filter(i => i !== item);
		} else {
			newSelectedItems = [...selectedItems, item];
		}
		newSelectedItems.sort();
		this.setState({ selectedItems: newSelectedItems });
		this.props.input.onChange(newSelectedItems);
	};

	isCheckboxChecked = item => {
		return this.state.selectedItems.includes(item);
	};

	render() {
		const { items, disabled, columns = 2 } = this.props;
		const columnsClass = 12 / columns;

		const elements = items.map((item, index) => (
			<div className={`col-xs-12 col-sm-${columnsClass}`} key={index}>
				{item &&
					item !== '' && (
						<ListItem
							leftCheckbox={
								<Checkbox
									checked={this.isCheckboxChecked(item)}
									disabled={disabled}
									onCheck={(e, isChecked) => {
										this.onCheckboxChecked(item);
									}}
								/>
							}
							primaryText={item}
						/>
					)}
			</div>
		));

		return (
			<List>
				<div className="row">{elements}</div>
			</List>
		);
	}
}
