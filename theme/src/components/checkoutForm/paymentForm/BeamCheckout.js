/* -*- mode: js2-jsx-mode -*- */
/* eslint-disable prettier/prettier */
/* eslint-env browser */
/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';

const HUB_REQ_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json'
};

let web3 = null;

export default class BeamButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hasWeb3: false,
			hasSufficientBalance: false,
			processing: false,
			transactionFee: 0,
			account: null
		};

		this.checkWeb3();
	}

	checkWeb3() {
		if (typeof window.web3 !== 'undefined') {
			web3 = new Web3(window.web3.currentProvider);
			web3.eth
				.getAccounts()
				.then(([account]) => {
					if (!account) {
						console.log('Maybe you need to log in to MetaMask?');
						throw new Error('Unable to get web3 account!');
					}
					console.log(`Web3 account: ${account}`);
					return this.setState({
						hasWeb3: true,
						account
					});
				})
				.then(() => {
					this.checkAvailableBalance();
				});
		} else {
			this.hasWeb3 = false;
		}
	}

	checkAvailableBalance() {
		const { formSettings } = this.props;
		const { hasWeb3, account } = this.state;

		if (!hasWeb3) {
			console.log('No web3!');
		}

		fetch(`${formSettings.hubUrl}/api/v1/receipts/${account}`)
			.then(response => {
				if (response.status !== 200) {
					console.log('No state channel found!');
				}
				return response.json();
			})
			.then(() =>
				fetch(`${formSettings.hubUrl}/api/v1/routes/routeInquiry`, {
					method: 'POST',
					headers: HUB_REQ_HEADERS,
					body: JSON.stringify({
						dstAddr: formSettings.merchantPublicKey,
						value: web3.utils
							.toWei(new web3.utils.BN(formSettings.amount))
							.toString(),
						srcAddr: account
					})
				})
			)
			.then(response => {
				if (response.status !== 200) {
					console.log('No route found!');
					throw new Error('Merchant account is unreachable!');
				}
				return response.json();
			})
			.then(data => {
				this.setState({
					hasSufficientBalance: true,
					transactionFee: web3.utils.fromWei(new web3.utils.BN(data.fee))
				});
			});
	}

	executePayment = () => {
		const { formSettings, onPayment } = this.props;
		const { account, transactionFee } = this.state;

		this.setState({
			processing: true
		});

		fetch(`${formSettings.hubUrl}/api/v1/receipts/${account}`)
			.then(response => {
				if (response.status !== 200) {
					console.log(
						'error getting receipt during payment execution:',
						response
					);
					throw new Error('Unable to get receipt during payment execution');
				}

				return response.json();
			})
			.then(async ({ receipt }) => {
				const routeReq = {
					dstAddr: formSettings.merchantPublicKey,
					value: web3.utils.toWei(`${formSettings.amount}`),
					receipt: {
						secret:
							'0x0000000000000000000000000000000000000000000000000000000000000000',
						receipt: await this.updateAndSignReceipt(
							receipt,
							web3.utils.toWei(new web3.utils.BN(formSettings.amount)),
							transactionFee,
							formSettings.merchantPaymentSecret
						)
					}
				};

				return fetch(`${formSettings.hubUrl}/api/v1/routes/routePayment`, {
					method: 'POST',
					headers: HUB_REQ_HEADERS,
					body: JSON.stringify(routeReq)
				});
			})
			.then(response => {
				if (response.status !== 200) {
					console.log('error routing payment:', response);
					throw new Error('Unable to route payment!');
				}

				return onPayment();
			});
	};

	async updateAndSignReceipt(receipt, amount, fee, secret) {
		const nonce = web3.utils.toBN(receipt.nonce).add(new web3.utils.BN(1));
		const actualFee = web3.utils.toBN(web3.utils.toWei(fee));
		const delta = web3.utils
			.toBN(receipt.walletServerDelta)
			.sub(amount.add(actualFee));
		const timeLockDuration = web3.utils.toBN('500').toString();
		const sigHash = web3.utils.soliditySha3(
			delta,
			nonce,
			timeLockDuration,
			secret
		);
		const prefixed = web3.utils.soliditySha3(
			'\x19Ethereum Signed Message:\n32',
			sigHash
		);
		const newReceipt = {
			channelId: receipt.channelId,
			walletServerDelta: delta.toString(),
			nonce: nonce.toString(),
			signer0: receipt.signer0,
			secretHash: secret,
			timeLockDuration
		};

		return web3.eth.sign(prefixed, receipt.signer0).then(signature => {
			newReceipt.sig0 = signature;

			return newReceipt;
		});
	}

	render() {
		const { processing, hasSufficientBalance, transactionFee } = this.state;

		const buttonClasses = ['checkout-button', 'button', 'is-primary'].join(' ');

		return (
			<div>
				<button
					type="button"
					onClick={this.executePayment}
					disabled={processing || !hasSufficientBalance}
					className={buttonClasses}
				>
					Pay with Beam (fee: {transactionFee.toString()}
					)!
				</button>
			</div>
		);
	}
}

BeamButton.propTypes = {
	formSettings: PropTypes.shape({
		amount: PropTypes.number.isRequired,
		hubUrl: PropTypes.string.isRequired,
		merchantPublicKey: PropTypes.string.isRequired,
		merchantPaymentSecret: PropTypes.string.isRequired
	}).isRequired,
	onPayment: PropTypes.func.isRequired
};
