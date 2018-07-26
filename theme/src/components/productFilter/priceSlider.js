import React from 'react';
import { NavLink } from 'react-router-dom';
import { Range } from 'rc-slider';
import { themeSettings, text } from '../../lib/settings';
import * as helper from '../../lib/helper';

export default class PriceSlider extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			minValue: props.minValue > 0 ? props.minValue : props.minPrice,
			maxValue: props.maxValue > 0 ? props.maxValue : props.maxPrice
		};
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.minPrice !== this.props.minPrice ||
			nextProps.maxPrice !== this.props.maxPrice
		) {
			this.setState({
				minValue: nextProps.minPrice,
				maxValue: nextProps.maxPrice
			});
		}
	}

	setValues = values => {
		if (Array.isArray(values) && values.length === 2) {
			this.setState({
				minValue: values[0],
				maxValue: values[1]
			});
		}
	};

	render() {
		const { minPrice, maxPrice, setPriceFromAndTo, settings } = this.props;

		return (
			<div className="price-filter">
				<div className="attribute-title">{text.price}</div>
				<Range
					min={minPrice}
					max={maxPrice}
					value={[this.state.minValue, this.state.maxValue]}
					disabled={maxPrice === 0}
					className="price-filter-range"
					onAfterChange={values => {
						setPriceFromAndTo(...values);
					}}
					onChange={this.setValues}
				/>
				<div className="columns is-mobile is-gapless price-filter-values">
					<div className="column has-text-left">
						{helper.formatCurrency(this.state.minValue, settings)}
					</div>
					<div className="column has-text-right">
						{helper.formatCurrency(this.state.maxValue, settings)}
					</div>
				</div>
			</div>
		);
	}
}
