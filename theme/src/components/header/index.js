import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../../lib/settings';
import Cart from './cart';
import CartIndicator from './cartIndicator';
import SearchBox from './searchBox';
import HeadMenu from './headMenu';

const Logo = ({ src, onClick, alt }) => (
	<NavLink className="logo-image" to="/" onClick={onClick}>
		<img src={src} alt={alt} />
	</NavLink>
);

const BurgerButton = ({ onClick, className }) => (
	<span className={className} onClick={onClick}>
		<span />
		<span />
		<span />
	</span>
);

const BackButton = ({ onClick }) => (
	<span
		className="navbar-item is-hidden-tablet is-flex-mobile"
		onClick={onClick}
	>
		<img
			className="icon"
			src="/assets/images/arrow_back.svg"
			style={{ width: 18 }}
		/>
	</span>
);

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobileMenuIsActive: false,
			mobileSearchIsActive: false,
			cartIsActive: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.props.state.cart !== nextProps.state.cart &&
			this.props.state.currentPage.path !== '/checkout'
		) {
			this.showCart();
		}
	}

	menuToggle = () => {
		this.setState({
			mobileMenuIsActive: !this.state.mobileMenuIsActive,
			cartIsActive: false
		});
		document.body.classList.toggle('noscroll');
	};

	searchToggle = () => {
		this.setState({
			mobileSearchIsActive: !this.state.mobileSearchIsActive
		});
		document.body.classList.toggle('search-active');
	};

	menuClose = () => {
		this.setState({ mobileMenuIsActive: false });
		document.body.classList.remove('noscroll');
	};

	closeAll = () => {
		this.setState({
			cartIsActive: false,
			mobileMenuIsActive: false
		});
		document.body.classList.remove('noscroll');
	};

	cartToggle = () => {
		this.setState({
			cartIsActive: !this.state.cartIsActive,
			mobileMenuIsActive: false
		});
		document.body.classList.toggle('noscroll');
	};

	showCart = () => {
		this.setState({
			cartIsActive: true,
			mobileMenuIsActive: false
		});
		document.body.classList.add('noscroll');
	};

	handleSearch = search => {
		if (this.props.state.currentPage.path === '/search') {
			this.props.setSearch(search);
		} else {
			if (search && search !== '') {
				this.props.setLocation('/search?search=' + search);
			}
		}
	};

	handleGoBack = () => {
		this.closeAll();
		this.props.goBack();
	};

	render() {
		const {
			categories,
			cart,
			settings,
			currentPage,
			location,
			productFilter
		} = this.props.state;
		const classToggle = this.state.mobileMenuIsActive
			? 'navbar-burger is-hidden-tablet is-active'
			: 'navbar-burger is-hidden-tablet';
		const showBackButton =
			currentPage.type === 'product' && location.hasHistory;

		return (
			<Fragment>
				<header
					className={this.state.mobileSearchIsActive ? 'search-active' : ''}
				>
					<div className="container">
						<div className="columns is-gapless is-mobile header-container">
							<div className="column is-4">
								{!showBackButton && (
									<BurgerButton
										onClick={this.menuToggle}
										className={classToggle}
									/>
								)}
								{showBackButton && <BackButton onClick={this.handleGoBack} />}
							</div>

							<div className="column is-4 has-text-centered">
								<Logo src={settings.logo} onClick={this.closeAll} alt="logo" />
							</div>
							<div className="column is-4 has-text-right header-block-right">
								<span
									className="icon icon-search is-hidden-tablet"
									onClick={this.searchToggle}
								>
									<img
										src="/assets/images/search.svg"
										alt={text.search}
										title={text.search}
										style={{ minWidth: 24 }}
									/>
								</span>
								<SearchBox
									value={productFilter.search}
									onSearch={this.handleSearch}
									className={
										this.state.mobileSearchIsActive ? 'search-active' : ''
									}
								/>

								<CartIndicator
									cart={cart}
									onClick={this.cartToggle}
									cartIsActive={this.state.cartIsActive}
								/>
								<div
									className={this.state.cartIsActive ? 'mini-cart-open' : ''}
								>
									<Cart
										cart={cart}
										deleteCartItem={this.props.deleteCartItem}
										settings={settings}
										cartToggle={this.cartToggle}
									/>
								</div>
							</div>
						</div>

						<div className="primary-nav is-hidden-mobile">
							<HeadMenu
								categories={categories}
								location={location}
								isMobile={false}
							/>
						</div>
					</div>
				</header>

				<div
					className={
						this.state.mobileMenuIsActive || this.state.cartIsActive
							? 'dark-overflow'
							: ''
					}
					onClick={this.closeAll}
				/>
				<div
					className={
						'mobile-nav is-hidden-tablet' +
						(this.state.mobileMenuIsActive ? ' mobile-nav-open' : '')
					}
				>
					<HeadMenu
						isMobile={true}
						categories={categories}
						location={location}
						onClick={this.menuClose}
					/>
				</div>
			</Fragment>
		);
	}
}
