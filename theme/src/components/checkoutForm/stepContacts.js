import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { themeSettings, text } from '../../lib/settings';
import { formatCurrency } from '../../lib/helper';
import InputField from './inputField';

const validateRequired = value =>
	value && value.length > 0 ? undefined : text.required;

const validateEmail = value =>
	value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
		? text.emailInvalid
		: undefined;

const ReadOnlyField = ({ name, value }) => {
	return (
		<div className="checkout-field-preview">
			<div className="name">{name}</div>
			<div className="value">{value}</div>
		</div>
	);
};

class CheckoutStepContacts extends React.Component {
	constructor(props) {
		super(props);
	}

	getField = fieldName => {
		const fields = this.props.checkoutFields || [];
		const field = fields.find(item => item.name === fieldName);
		return field;
	};

	getFieldStatus = fieldName => {
		const field = this.getField(fieldName);
		return field && field.status ? field.status : 'required';
	};

	isFieldOptional = fieldName => {
		return this.getFieldStatus(fieldName) === 'optional';
	};

	isFieldHidden = fieldName => {
		return this.getFieldStatus(fieldName) === 'hidden';
	};

	getFieldValidators = fieldName => {
		const isOptional = this.isFieldOptional(fieldName);
		let validatorsArray = [];
		if (!isOptional) {
			validatorsArray.push(validateRequired);
		}
		if (fieldName === 'email') {
			validatorsArray.push(validateEmail);
		}

		return validatorsArray;
	};

	getFieldPlaceholder = fieldName => {
		const field = this.getField(fieldName);
		return field && field.placeholder && field.placeholder.length > 0
			? field.placeholder
			: '';
	};

	getFieldLabelText = fieldName => {
		const field = this.getField(fieldName);
		if (field && field.label && field.label.length > 0) {
			return field.label;
		} else {
			switch (fieldName) {
				case 'email':
					return text.email;
					break;
				case 'mobile':
					return text.mobile;
					break;
				case 'country':
					return text.country;
					break;
				case 'state':
					return text.state;
					break;
				case 'city':
					return text.city;
					break;
				default:
					return 'Unnamed field';
			}
		}
	};

	getFieldLabel = fieldName => {
		const labelText = this.getFieldLabelText(fieldName);
		return this.isFieldOptional(fieldName)
			? `${labelText} (${text.optional})`
			: labelText;
	};

	render() {
		const {
			handleSubmit,
			pristine,
			invalid,
			valid,
			reset,
			submitting,
			loadingShippingMethods,
			loadingPaymentMethods,
			initialValues,
			settings,
			saveShippingLocation,
			saveShippingMethod,
			savePaymentMethod,
			paymentMethods,
			shippingMethods,
			inputClassName,
			buttonClassName,
			editButtonClassName,
			onEdit,
			isReadOnly,
			title
		} = this.props;

		if (isReadOnly) {
			return (
				<div className="checkout-step">
					<h1>
						<span>1</span>
						{title}
					</h1>

					{!this.isFieldHidden('email') && (
						<ReadOnlyField name={text.email} value={initialValues.email} />
					)}
					{!this.isFieldHidden('mobile') && (
						<ReadOnlyField name={text.mobile} value={initialValues.mobile} />
					)}
					{!this.isFieldHidden('country') && (
						<ReadOnlyField
							name={text.country}
							value={initialValues.shipping_address.country}
						/>
					)}
					{!this.isFieldHidden('state') && (
						<ReadOnlyField
							name={text.state}
							value={initialValues.shipping_address.state}
						/>
					)}
					{!this.isFieldHidden('city') && (
						<ReadOnlyField
							name={text.city}
							value={initialValues.shipping_address.city}
						/>
					)}
					<ReadOnlyField
						name={text.shippingMethod}
						value={initialValues.shipping_method}
					/>
					<ReadOnlyField
						name={text.paymentMethod}
						value={initialValues.payment_method}
					/>

					<div className="checkout-button-wrap">
						<button
							type="button"
							onClick={onEdit}
							className={editButtonClassName}
						>
							{text.edit}
						</button>
					</div>
				</div>
			);
		} else {
			return (
				<div className="checkout-step">
					<h1>
						<span>1</span>
						{title}
					</h1>
					<form onSubmit={handleSubmit}>
						{!this.isFieldHidden('email') && (
							<Field
								className={inputClassName}
								name="email"
								id="customer.email"
								component={InputField}
								type="email"
								label={this.getFieldLabel('email')}
								validate={this.getFieldValidators('email')}
								placeholder={this.getFieldPlaceholder('email')}
							/>
						)}

						{!this.isFieldHidden('mobile') && (
							<Field
								className={inputClassName}
								name="mobile"
								id="customer.mobile"
								component={InputField}
								type="tel"
								label={this.getFieldLabel('mobile')}
								validate={this.getFieldValidators('mobile')}
								placeholder={this.getFieldPlaceholder('mobile')}
							/>
						)}

						<h2>{text.shippingTo}</h2>

						{!this.isFieldHidden('country') && (
							<Field
								className={inputClassName}
								name="shipping_address.country"
								id="shipping_address.country"
								component={InputField}
								type="text"
								label={this.getFieldLabel('country')}
								validate={this.getFieldValidators('country')}
								placeholder={this.getFieldPlaceholder('country')}
								onBlur={(event, value) =>
									setTimeout(() => saveShippingLocation({ country: value }))
								}
							/>
						)}

						{!this.isFieldHidden('state') && (
							<Field
								className={inputClassName}
								name="shipping_address.state"
								id="shipping_address.state"
								component={InputField}
								type="text"
								label={this.getFieldLabel('state')}
								validate={this.getFieldValidators('state')}
								placeholder={this.getFieldPlaceholder('state')}
								onBlur={(event, value) =>
									setTimeout(() => saveShippingLocation({ state: value }))
								}
							/>
						)}

						{!this.isFieldHidden('city') && (
							<Field
								className={inputClassName}
								name="shipping_address.city"
								id="shipping_address.city"
								component={InputField}
								type="text"
								label={this.getFieldLabel('city')}
								validate={this.getFieldValidators('city')}
								placeholder={this.getFieldPlaceholder('city')}
								onBlur={(event, value) =>
									setTimeout(() => saveShippingLocation({ city: value }))
								}
							/>
						)}

						<h2>
							{text.shippingMethods}{' '}
							{loadingShippingMethods && <small>{text.loading}</small>}
						</h2>
						<div className="shipping-methods">
							{shippingMethods.map((method, index) => (
								<label
									key={index}
									className={
										'shipping-method' +
										(method.id === initialValues.shipping_method_id
											? ' active'
											: '')
									}
								>
									<Field
										name="shipping_method_id"
										component="input"
										type="radio"
										value={method.id}
										onClick={() => saveShippingMethod(method.id)}
									/>
									<div>
										<div className="shipping-method-name">{method.name}</div>
										<div className="shipping-method-description">
											{method.description}
										</div>
									</div>
									<span className="shipping-method-rate">
										{formatCurrency(method.price, settings)}
									</span>
								</label>
							))}
						</div>

						<h2>
							{text.paymentMethods}{' '}
							{loadingPaymentMethods && <small>{text.loading}</small>}
						</h2>
						<div className="payment-methods">
							{paymentMethods.map((method, index) => (
								<label
									key={index}
									className={
										'payment-method' +
										(method.id === initialValues.payment_method_id
											? ' active'
											: '')
									}
								>
									<Field
										name="payment_method_id"
										validate={[validateRequired]}
										component="input"
										type="radio"
										value={method.id}
										onClick={() => savePaymentMethod(method.id)}
									/>
									<div>
										<div className="payment-method-name">{method.name}</div>
										<div className="payment-method-description">
											{method.description}
										</div>
									</div>
									<span className="payment-method-logo" />
								</label>
							))}
						</div>

						<div className="checkout-button-wrap">
							<button
								type="submit"
								disabled={invalid}
								className={buttonClassName}
							>
								{text.next}
							</button>
						</div>
					</form>
				</div>
			);
		}
	}
}

export default reduxForm({
	form: 'CheckoutStepContacts',
	enableReinitialize: true,
	keepDirtyOnReinitialize: true
})(CheckoutStepContacts);
