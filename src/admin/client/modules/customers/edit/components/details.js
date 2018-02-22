import React from 'react'

import messages from 'lib/text'
import style from './style.css'

import CustomerSummary from './summary'
import CustomerOrders from './orders'
import CustomerAddresses from './addresses'

export default class CustomerDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchData();
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    const {customer, settings, onCustomerSummaryUpdate, onUpdateAddress, onDeleteAddress, onSetDefaultBillingAddress, onSetDefaultShippingAddress} = this.props;
    if (!customer)
      return <br/>

    return (
      <div className="row row--no-gutter col-full-height">
        <div className="col-xs-12 col-sm-5 col-md-4 col--no-gutter scroll col-full-height">
          <CustomerSummary
            customer={customer}
            settings={settings}
            onCustomerSummaryUpdate={onCustomerSummaryUpdate} />

          <CustomerAddresses
            customer={customer}
            settings={settings}
            onUpdateAddress={onUpdateAddress}
            onDeleteAddress={onDeleteAddress}
            onSetDefaultBillingAddress={onSetDefaultBillingAddress}
            onSetDefaultShippingAddress={onSetDefaultShippingAddress} />
        </div>
        <div className="col-xs-12 col-sm-7 col-md-8 col--no-gutter scroll col-full-height">
          <CustomerOrders customerId={customer.id} settings={settings}/>
        </div>
      </div>
    )
  }
}
