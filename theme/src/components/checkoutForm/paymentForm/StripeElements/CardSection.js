import React, { Fragment } from 'react';
import { CardElement } from 'react-stripe-elements';

const CardSection = ({ title }) => (
	<Fragment>
		<p>{title}</p>
		<CardElement />
	</Fragment>
);

export default CardSection;
