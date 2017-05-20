import { connect } from 'react-redux'
import { fetchCustomer, clearCustomerDetails, updateCustomer, updateAddress, deleteAddress, setDefaultBillingAddress, setDefaultShippingAddress } from '../actions'
import CustomerDetails from './components/details'

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings,
    customer: state.customers.editCustomer
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      dispatch(fetchCustomer(ownProps.customerId));
    },
    clearData: () => {
      dispatch(clearCustomerDetails());
    },
    onUpdateAddress: (address) => {
      dispatch(updateAddress(ownProps.customerId, address.id, address));
    },
    onDeleteAddress: (addressId) => {
      dispatch(deleteAddress(ownProps.customerId, addressId));
    },
    onSetDefaultBillingAddress: (addressId) => {
      dispatch(setDefaultBillingAddress(ownProps.customerId, addressId));
    },
    onSetDefaultShippingAddress: (addressId) => {
      dispatch(setDefaultShippingAddress(ownProps.customerId, addressId));
    },
    onCustomerSummaryUpdate: (customer) => {
      dispatch(updateCustomer({
        id: customer.id,
        note: customer.note,
        full_name:  customer.full_name,
        group_id: customer.group_id,
        email: customer.email,
        mobile: customer.mobile
      }));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetails);
