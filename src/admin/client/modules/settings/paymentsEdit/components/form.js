import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField, SelectField } from 'redux-form-material-ui';

import { CustomToggle } from 'modules/shared/form';
import PaymentGateway from 'modules/settings/paymentGateway';
import { AVAILABLE_PAYMENT_GATEWAYS } from 'modules/settings/paymentGateway/availablePaymentGateways';
import SelectShippingMethodsField from './selectShipping.js';
import messages from 'lib/text';
import style from './style.css';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

const validate = values => {
	const errors = {};
	const requiredFields = ['name'];

	requiredFields.map(field => {
		if (values && !values[field]) {
			errors[field] = messages.errors_required;
		}
	});

	return errors;
};

class EditPaymentMethodForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gateway: null
		};
	}

	componentDidMount() {
		this.props.onLoad();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.initialValues !== this.props.initialValues) {
			this.setState({
				gateway: nextProps.initialValues.gateway
			});
		}
	}

	onGatewayChange = gateway => {
		this.setState({
			gateway: gateway
		});
	};

	render() {
		let {
			handleSubmit,
			pristine,
			submitting,
			initialValues,
			shippingMethods,
			methodId,
			settings
		} = this.props;
		const isAdd = methodId === null || methodId === undefined;
		let paymentGateways = [];
		paymentGateways.push(<MenuItem value="" key="none" primaryText="None" />);
		for (const gateway of AVAILABLE_PAYMENT_GATEWAYS) {
			paymentGateways.push(
				<MenuItem
					value={gateway.key}
					key={gateway.key}
					primaryText={gateway.name}
				/>
			);
		}

		return (
			<form onSubmit={handleSubmit}>
				<Paper className="paper-box" zDepth={1}>
					<div className={style.innerBox}>
						<div className="row">
							<div className="col-xs-12 col-sm-4">
								<div className="blue-title">{messages.paymentGateway}</div>
							</div>
							<div className="col-xs-12 col-sm-8">
								<div>
									<Field
										component={SelectField}
										autoWidth={true}
										fullWidth={true}
										name="gateway"
										floatingLabelFixed={true}
										floatingLabelText={messages.paymentGateway}
										onChange={(event, currentValue, prevValue) => {
											this.onGatewayChange(currentValue);
										}}
									>
										{paymentGateways}
									</Field>
								</div>
								<PaymentGateway gateway={this.state.gateway} />
							</div>
						</div>

						<div className="row" style={{ marginTop: '40px' }}>
							<div className="col-xs-12 col-sm-4">
								<div className="blue-title">{messages.description}</div>
							</div>
							<div className="col-xs-12 col-sm-8">
								<div>
									<Field
										component={TextField}
										fullWidth={true}
										name="name"
										floatingLabelText={messages.settings_paymentMethodName}
									/>
								</div>
								<div>
									<Field
										component={TextField}
										fullWidth={true}
										name="description"
										multiLine={true}
										floatingLabelText={messages.description}
									/>
								</div>
								<div>
									<Field
										component={CustomToggle}
										name="enabled"
										label={messages.enabled}
										style={{ paddingTop: 16, paddingBottom: 20 }}
									/>
								</div>
								<Divider />
							</div>
						</div>

						<div className="row" style={{ marginTop: '40px' }}>
							<div className="col-xs-12 col-sm-4">
								<div className="blue-title">{messages.settings_conditions}</div>
							</div>
							<div className="col-xs-12 col-sm-8">
								<div>
									<Field
										component={TextField}
										fullWidth={true}
										name="conditions.countries"
										floatingLabelText={messages.settings_countries}
										hintText="US,UK,AU,SG"
									/>
								</div>
								<div className="row">
									<div className="col-xs-6">
										<Field
											component={TextField}
											name="conditions.subtotal_min"
											type="number"
											fullWidth={true}
											floatingLabelText={
												messages.settings_minSubtotal +
												` (${settings.currency_symbol})`
											}
										/>
									</div>
									<div className="col-xs-6">
										<Field
											component={TextField}
											name="conditions.subtotal_max"
											type="number"
											fullWidth={true}
											floatingLabelText={
												messages.settings_maxSubtotal +
												` (${settings.currency_symbol})`
											}
										/>
									</div>
								</div>
								<div className="gray-title" style={{ marginTop: '30px' }}>
									{messages.settings_onlyShippingMethods}
								</div>
								<Field
									name="conditions.shipping_method_ids"
									component={SelectShippingMethodsField}
									shippingMethods={shippingMethods}
								/>
							</div>
						</div>
					</div>
					<div className="buttons-box">
						<RaisedButton
							type="submit"
							label={isAdd ? messages.add : messages.save}
							primary={true}
							className={style.button}
							disabled={pristine || submitting}
						/>
					</div>
				</Paper>
			</form>
		);
	}
}

export default reduxForm({
	form: 'EditPaymentMethodForm',
	validate,
	enableReinitialize: true
})(EditPaymentMethodForm);
