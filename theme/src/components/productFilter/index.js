import React from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../../lib/settings';

import Sort from '../sort';
import PriceSlider from './priceSlider';
import AttributeFilter from './attributeFilter';

export default class ProductFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebarIsActive: false
		};
	}

	sidebarToggle = () => {
		this.setState({
			sidebarIsActive: !this.state.sidebarIsActive
		});
		document.body.classList.toggle('noscroll');
	};

	sidebarClose = () => {
		this.setState({ sidebarIsActive: false });
		document.body.classList.remove('noscroll');
	};

	render() {
		const { sidebarIsActive } = this.state;
		const {
			categoryDetails,
			categories,
			settings,
			productFilter,
			productsMinPrice,
			productsMaxPrice,
			productsAttributes
		} = this.props.state;

		return (
			<div>
				<div className="is-hidden-tablet">
					<button className="button is-fullwidth" onClick={this.sidebarToggle}>
						{text.filterProducts}
					</button>
				</div>

				<div
					className={sidebarIsActive ? 'modal is-active' : 'is-hidden-mobile'}
					style={{ zIndex: 101 }}
				>
					<div
						className={sidebarIsActive ? 'dark-overflow' : ''}
						onClick={this.sidebarClose}
					/>
					<div className={sidebarIsActive ? 'modal-content' : ''}>
						<div className={sidebarIsActive ? 'box sidebar' : ''}>
							<div className="is-hidden-tablet" style={{ marginBottom: 30 }}>
								<Sort
									defaultSort={settings.default_product_sorting}
									currentSort={productFilter.sort}
									setSort={this.props.setSort}
								/>
							</div>

							<AttributeFilter
								attributes={productsAttributes}
								setFilterAttribute={this.props.setFilterAttribute}
								unsetFilterAttribute={this.props.unsetFilterAttribute}
							/>

							<PriceSlider
								minPrice={productsMinPrice}
								maxPrice={productsMaxPrice}
								minValue={productFilter.priceFrom}
								maxValue={productFilter.priceTo}
								setPriceFromAndTo={this.props.setPriceFromAndTo}
								settings={settings}
							/>

							<button
								className="button is-fullwidth is-dark is-hidden-tablet"
								onClick={this.sidebarClose}
							>
								{text.close}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
