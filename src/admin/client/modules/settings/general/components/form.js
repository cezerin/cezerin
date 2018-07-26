import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { TextField, SelectField, DatePicker } from 'redux-form-material-ui';

import { CustomToggle } from 'modules/shared/form';
import messages from 'lib/text';
import style from './style.css';
import data from 'lib/data';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

class GeneralSettings extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		let { handleSubmit, pristine, submitting, initialValues } = this.props;

		let currencyItems = [];
		for (const key in data.currencies) {
			currencyItems.push(
				<MenuItem
					value={key}
					key={key}
					primaryText={`${key} - ${data.currencies[key]}`}
				/>
			);
		}

		let timezoneItems = [];
		for (const key in data.timezones) {
			const utc = data.timezones[key].utc;
			const utcPretty = `${utc.slice(0, -2)}:${utc.slice(-2)}`;
			timezoneItems.push(
				<MenuItem
					value={key}
					key={key}
					primaryText={`(UTC${utcPretty}) ${key}`}
				/>
			);
		}

		let countryItems = [];
		for (const key in data.countries) {
			countryItems.push(
				<MenuItem value={key} key={key} primaryText={data.countries[key]} />
			);
		}

		return (
			<form
				onSubmit={handleSubmit}
				style={{
					display: 'initial',
					width: '100%'
				}}
			>
				<Paper className="paper-box" zDepth={1}>
					<div style={{ width: '100%' }}>
						<List>
							<Link
								to={'/admin/settings/general/logo'}
								style={{ textDecoration: 'none' }}
							>
								<ListItem
									rightIcon={
										<FontIcon className="material-icons">
											keyboard_arrow_right
										</FontIcon>
									}
									primaryText={messages.logo}
								/>
							</Link>
							<Divider />
						</List>
					</div>

					<div className={style.innerBox}>
						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">{messages.currency}</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="currency_code"
								>
									{currencyItems}
								</Field>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_currencyFormatting}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={TextField}
									fullWidth={true}
									name="currency_format"
									floatingLabelText={messages.settings_currencyFormatting}
								/>

								<Field
									component={TextField}
									fullWidth={true}
									name="currency_symbol"
									floatingLabelText={messages.settings_currencySymbol}
								/>

								<Field
									component={SelectField}
									autoWidth={true}
									floatingLabelFixed={true}
									fullWidth={true}
									name="thousand_separator"
									floatingLabelText={messages.settings_thousandSeparator}
								>
									<MenuItem value="." primaryText="5.000.000" />
									<MenuItem value="," primaryText="5,000,000" />
									<MenuItem value=" " primaryText="5 000 000" />
									<MenuItem value="" primaryText="5000000" />
								</Field>

								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="decimal_separator"
									floatingLabelText={messages.settings_decimalSeparator}
								>
									<MenuItem value="." primaryText="100.00" />
									<MenuItem value="," primaryText="100,00" />
								</Field>

								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="decimal_number"
									floatingLabelText={messages.settings_numberOfDecimal}
								>
									<MenuItem value={0} primaryText="100" />
									<MenuItem value={1} primaryText="100.0" />
									<MenuItem value={2} primaryText="100.00" />
									<MenuItem value={3} primaryText="100.000" />
									<MenuItem value={4} primaryText="100.0000" />
								</Field>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_timezone}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="timezone"
								>
									{timezoneItems}
								</Field>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_dateFormat}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="date_format"
								>
									<MenuItem
										value="MMMM D, YYYY"
										primaryText="January 30, 2017"
									/>
									<MenuItem value="D MMMM YYYY" primaryText="30 January 2017" />
									<MenuItem value="YYYY-MM-DD" primaryText="2017-01-30" />
									<MenuItem value="YYYY-M-D" primaryText="2017-1-30" />
									<MenuItem value="MM/DD/YYYY" primaryText="01/30/2017" />
									<MenuItem value="MM.DD.YYYY" primaryText="01.30.2017" />
									<MenuItem value="DD/MM/YYYY" primaryText="30/01/2017" />
									<MenuItem value="DD.MM.YYYY" primaryText="30.01.2017" />
								</Field>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_timeFormat}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="time_format"
								>
									<MenuItem value="h:mm a" primaryText="2:30 pm" />
									<MenuItem value="h:mm A" primaryText="2:30 PM" />
									<MenuItem value="HH:mm" primaryText="14:30" />
								</Field>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_weightUnit}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="weight_unit"
								>
									<MenuItem
										value="g"
										primaryText={messages.settings_gram + ' (g)'}
									/>
									<MenuItem
										value="kg"
										primaryText={messages.settings_kilogram + ' (kg)'}
									/>
									<MenuItem
										value="lb"
										primaryText={messages.settings_pound + ' (lb)'}
									/>
									<MenuItem
										value="oz"
										primaryText={messages.settings_ounce + ' (oz)'}
									/>
								</Field>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_lengthUnit}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="length_unit"
								>
									<MenuItem
										value="cm"
										primaryText={messages.settings_centimeter + ' (cm)'}
									/>
									<MenuItem
										value="in"
										primaryText={messages.settings_inch + ' (in)'}
									/>
								</Field>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_defaultProductSorting}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={TextField}
									fullWidth={true}
									name="default_product_sorting"
									placeholder="-position,stock_status,price"
								/>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">{messages.productFields}</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={TextField}
									fullWidth={true}
									name="product_fields"
									placeholder="id,path,name,price, ..."
								/>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">{messages.productsLimit}</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={TextField}
									fullWidth={true}
									name="products_limit"
									type="number"
									placeholder="30"
								/>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_defaultShippingCountry}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={SelectField}
									autoWidth={true}
									fullWidth={true}
									name="default_shipping_country"
								>
									{countryItems}
								</Field>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_defaultShippingState}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={TextField}
									fullWidth={true}
									name="default_shipping_state"
								/>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.settings_defaultShippingCity}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={TextField}
									fullWidth={true}
									name="default_shipping_city"
								/>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<Field
							component={CustomToggle}
							name="hide_billing_address"
							label={messages.hideBillingAddress}
							style={{ paddingTop: 16, paddingBottom: 16 }}
						/>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">{messages.domain}</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={TextField}
									fullWidth={true}
									name="domain"
									placeholder="https://domain.com"
								/>
							</div>
						</div>

						<Divider
							style={{
								marginTop: 10,
								marginBottom: 10
							}}
						/>

						<div className="row between-xs middle-xs">
							<div className="col-xs-12 col-sm-6">
								{messages.orderEmailCopyTo}
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									component={TextField}
									fullWidth={true}
									name="order_confirmation_copy_to"
								/>
							</div>
						</div>
					</div>
					<div className="buttons-box">
						<RaisedButton
							type="submit"
							label={messages.save}
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
	form: 'GeneralSettingsForm',
	enableReinitialize: true
})(GeneralSettings);
