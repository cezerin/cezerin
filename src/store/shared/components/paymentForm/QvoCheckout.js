import React from 'react'
import text from '../../text'
import { formatCurrency } from '../../lib/helper'
import api from '../../../client/api'
import fetch from 'node-fetch'

export default class QvoCheckout extends React.Component {
  constructor (props) {
    super(props)
    this.formSettings = props.formSettings
    this.shopSettings = this.props.shopSettings 
    this.onPayment = this.props.onPayment
    this.scriptAdded = false
  }

  componentDidMount () {
    this.addScript()
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
      this.executeScript()
    };
    container.appendChild(script);
    this.scriptAdded = true;
  }

  executeScript () {
    console.log('api:', api)
    const publicKey = this.formSettings.publicKey
    // Render del botón
    qvo.button.render({

      env: 'sandbox', // sandbox | production

      // Crea una cuenta QVO: https://dashboard-test.qvo.cl/signup
      keys: {
        sandbox: publicKey,
        production: publicKey
      },

      // El monto a cobrar
      amount: this.formSettings.amount,

      // La descripción del cobro
      description: `Orden #${this.formSettings.orderNumber}`,

      // El nombre de tu negocio
      name: this.formSettings.storeName,

      // Link a la imagen que deseas que aparezca en el checkout
      image: this.formSettings.logo,
      

      // onSuccess() es llamado cuando el pago ha sido correcto
      onSuccess: async function (response) {
        // Aquí puedes llamar a tu servidor para verificar la transacción
        const transaction = await fetch(`https://playground.qvo.cl/transactions/${response.id}`, {
          headers: {
            'Authorization': `Bearer ${publicKey}`
          }
        })
        console.log('transaction:', JSON.parse(transaction))
        // const res = await api.orders.update(this.formSettings.order_id, {paid: true})
        console.log('response:', res)
        setTimeout(function() {
          window.alert('Pago Completado 😁!');
        }, 500);
      },

      // onCancel() es llamado cuando el usuario cierra el formulario
      onCancel: function () {
        window.alert('Usuario canceló 🙁');
      },

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
    }, '#qvo-button-container'); 
  }

  render() {
    console.log('this.formSettings:', this.formSettings)
    return (
      <div id="qvo-checkout" style={{marginLeft: '35%'}}>
        <div id="qvo-button-container"></div> 
      </div>
    )
  }
}
