import React from 'react';

export default class QvoCheckout extends React.Component {
	constructor(props) {
		super(props);
		this.formSettings = props.formSettings;
		this.shopSettings = props.shopSettings;
		this.onPayment = props.onPayment;
		this.scriptAdded = false;
	}

	componentDidMount() {
		this.addScript();
	}

	addScript = () => {
		if (this.scriptAdded) {
			this.executeScript();
			return;
		}

		const SCRIPT_URL = 'https://cdn.qvo.cl/checkout.min.js';
		const container = document.head;
		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.onload = () => {
			this.executeScript();
		};
		container.appendChild(script);
		this.scriptAdded = true;
	};

	executeScript() {
		const { formSettings, shopSettings, onPayment } = this.props;
		// Render del botón
		qvo.button.render(
			{
				env: 'sandbox', // sandbox | production
				// Crea una cuenta QVO: https://dashboard-test.qvo.cl/signup
				keys: {
					sandbox: formSettings.publicKey,
					production: formSettings.publicKey
				},
				// El monto a cobrar
				amount: this.formSettings.amount,
				// La descripción del cobro
				description: `Orden #${this.formSettings.orderNumber}`,
				// El nombre de tu negocio
				name: this.formSettings.storeName,
				// Link a la imagen que deseas que aparezca en el checkout
				image: this.formSettings.logo,
				// Puedes pre-llenar los datos del cliente ...
				customer: {
					name: this.formSettings.clientName,
					email: this.formSettings.clientEmail,
					phone: this.formSettings.clientMobile
				},
				// .. así como también personalizar los colores del checkout
				// theme: {
				//   mainColor: '#3091c8',
				//   buttonColor: '#3091c8'
				// },
				// onSuccess() es llamado cuando el pago ha sido correcto
				onSuccess: async function(response) {
					// Aquí puedes llamar a tu servidor para verificar la transacción
					setTimeout(function() {
						window.alert('Pago Completado 😁!');
					}, 500);
					setTimeout(onPayment, 500);
				},
				// onCancel() es llamado cuando el usuario cierra el formulario
				onCancel: function() {
					window.alert('Usuario canceló 🙁');
				}
			},
			'#qvo-button-container'
		);
	}

	render() {
		return (
			<div id="qvo-checkout" style={{ marginLeft: '35%' }}>
				<div id="qvo-button-container" />
			</div>
		);
	}
}
