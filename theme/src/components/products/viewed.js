import React from 'react';
import PropTypes from 'prop-types';
import { text } from '../../lib/settings';
import CustomProductList from './custom';

export default class ViewedProducts extends React.Component {
	static propTypes = {
		limit: PropTypes.number.isRequired,
		settings: PropTypes.shape({}).isRequired,
		addCartItem: PropTypes.func.isRequired,
		product: PropTypes.shape({}).isRequired
	};

	state = {
		viewedProducts: []
	};

	componentDidMount() {
		const { product } = this.props;
		const viewedProducts = this.getArrayFromLocalStorage();
		this.setState({ viewedProducts });

		if (product && product.id) {
			this.addProductIdToLocalStorage(product.id);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.props.product !== nextProps.product &&
			nextProps.product &&
			nextProps.product.id
		) {
			this.addProductIdToLocalStorage(nextProps.product.id);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.viewedProducts !== nextState.viewedProducts;
	}

	getArrayFromLocalStorage = () => {
		let values = [];
		const viewedProducts = localStorage.getItem('viewedProducts');

		try {
			if (viewedProducts && viewedProducts.length > 0) {
				const viewedProductsParsed = JSON.parse(viewedProducts);
				if (Array.isArray(viewedProductsParsed)) {
					values = viewedProductsParsed;
				}
			}
		} catch (e) {
			//
		}

		return values;
	};

	addProductIdToLocalStorage = productId => {
		if (productId && productId.length > 0) {
			const viewedProducts = this.getArrayFromLocalStorage();

			if (viewedProducts.includes(productId)) {
				const index = viewedProducts.indexOf(productId);
				viewedProducts.splice(index, 1);
				viewedProducts.push(productId);
			} else {
				viewedProducts.push(productId);
			}

			localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
			this.setState({ viewedProducts });
		}
	};

	render() {
		const { limit, settings, addCartItem, product } = this.props;
		let { viewedProducts } = this.state;

		if (viewedProducts && product && product.id) {
			viewedProducts = viewedProducts.filter(id => id !== product.id);
		}

		if (viewedProducts && viewedProducts.length > 0) {
			const ids = viewedProducts.reverse().slice(0, limit);
			return (
				<section className="section section-product-related">
					<div className="container">
						<div className="title is-4 has-text-centered">
							{text.recentlyViewed}
						</div>
						<CustomProductList
							ids={ids}
							settings={settings}
							addCartItem={addCartItem}
							limit={limit}
							isCentered
						/>
					</div>
				</section>
			);
		}
		return null;
	}
}
