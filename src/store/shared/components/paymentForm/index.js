import React from 'react'
import api from '../../../client/api'
import PayPalCheckout from './PayPalCheckout'
import LiqPay from './LiqPay'
import WebpayCheckout from './WebpayCheckout'

export default class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSettings: null,
      loading: false
    };
  }

  fetchFormSettings = () => {
    this.setState({
      loading: true
    });

    api.ajax.paymentFormSettings.retrieve().then(({ status, json }) => {
      console.log('json:', json);
      this.setState({
        formSettings: json,
        loading: false
      });
    })
    .catch(e => {
      this.setState({
        formSettings: null,
        loading: false
      });
      console.log(e);
    });
  }

  componentDidMount() {
    this.fetchFormSettings();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.gateway !== this.props.gateway || nextProps.amount !== this.props.amount){
      this.fetchFormSettings();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.gateway !== this.props.gateway || nextProps.amount !== this.props.amount || this.state !== nextState;
  }

  render() {
    const { gateway, shopSettings, onPayment } = this.props;
    console.log('gateway:', gateway);
    const { formSettings, loading } = this.state;

    if(loading){
      return null;
    } else if(formSettings && gateway && gateway !== '') {
      console.log('gateway:', gateway);
      switch(gateway){
        case 'transbank-webpay':
          return (
            <div className="payment-form">
              <WebpayCheckout formSettings={formSettings} shopSettings={shopSettings} onPayment={onPayment} />
            </div>
          )
        case 'paypal-checkout':
          return (
            <div className="payment-form">
              <PayPalCheckout formSettings={formSettings} shopSettings={shopSettings} onPayment={onPayment} />
            </div>
          )
        case 'liqpay':
          return (
            <div className="payment-form">
              <LiqPay formSettings={formSettings} shopSettings={shopSettings} onPayment={onPayment} />
            </div>
          )
        default:
          return (
            <div>asdfasdPayment Gateway <b>{gateway}</b> not found!</div>
          )
      }
    } else {
      return null;
    }
  }
}
