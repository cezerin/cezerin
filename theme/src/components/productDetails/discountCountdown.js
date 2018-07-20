import React from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../../lib/settings';

export default class DiscountCountdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timer: null,
			diff: null
		};
	}

	componentDidMount() {
		let timer = setInterval(this.tick, 1000);
		this.setState({
			timer: timer
		});
	}

	componentWillUnmount() {
		clearInterval(this.state.timer);
	}

	tick = () => {
		const dateNow = new Date();
		const dateTo = new Date(this.props.product.date_sale_to);
		const diff = Math.abs(
			Math.floor((dateTo.getTime() - dateNow.getTime()) / 1000)
		);

		this.setState({
			diff: diff
		});
	};

	pad = num => {
		return num < 10 ? '0' + num : num;
	};

	render() {
		const { product } = this.props;
		const { diff } = this.state;

		if (product) {
			let days = Math.floor(diff / (24 * 60 * 60));
			let leftSec = diff - days * 24 * 60 * 60;

			let hrs = Math.floor(leftSec / (60 * 60));
			leftSec = leftSec - hrs * 60 * 60;

			let min = Math.floor(leftSec / 60);
			leftSec = leftSec - min * 60;

			return (
				<div className="discount-countdown">
					<div className="discount-title">{text.saleEnds}:</div>

					<div
						className="columns is-mobile has-text-centered discount-numbers is-gapless"
						style={{ margin: '8px 0' }}
					>
						<div className="column is-2">{this.pad(days)}</div>
						<div className="column is-1">:</div>
						<div className="column is-2">{this.pad(hrs)}</div>
						<div className="column is-1">:</div>
						<div className="column is-2">{this.pad(min)}</div>
						<div className="column is-1">:</div>
						<div className="column is-2">{this.pad(leftSec)}</div>
					</div>

					<div className="columns is-mobile has-text-centered discount-labels is-gapless">
						<div className="column is-2">{text.days}</div>
						<div className="column is-1" />
						<div className="column is-2">{text.hours}</div>
						<div className="column is-1" />
						<div className="column is-2">{text.minutes}</div>
						<div className="column is-1" />
						<div className="column is-2">{text.seconds}</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}
