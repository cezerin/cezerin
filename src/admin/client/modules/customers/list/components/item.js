import React from 'react';
import { Link } from 'react-router'
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import messages from 'src/locales'
import settings from 'lib/settings'
import style from './style.css'

const FormattedPrice = (price, currency, language) => (
  price.toLocaleString(language, { style: 'currency', currency: currency })
)

const CustomersListItem = ({ customer, onSelect, selected }) => {
  const checked = selected.includes(customer.id);
  let totalSpentFormatted = FormattedPrice(customer.total_spent || 0, settings.currency, settings.language);

  return (
    <div>
      <ListItem style={{ cursor: 'normal' }}
        primaryText={
          <div className="row middle-xs">
            <div className="col-xs-1">
              <Checkbox checked={checked} onCheck={(event, isInputChecked) => { onSelect(customer.id, isInputChecked); }} />
            </div>
            <div className="col-xs-5">
              <Link to={'/admin/customer/'+customer.id} className={style.customerName}>
              {customer.full_name}<br />
              <small>{customer.group_name}</small>
              </Link>
            </div>
            <div className={"col-xs-3 " + style.location}>
              {customer.shipping && customer.shipping.city &&
                <span><FontIcon style={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: 16, marginRight: 6 }} className="material-icons">place</FontIcon>{customer.shipping.city}</span>
              }
            </div>
            <div className="col-xs-1">
              {customer.orders_count || 0}
            </div>
            <div className={"col-xs-2 " + style.price}>
              {totalSpentFormatted}
            </div>
          </div>
        }
      />
      <Divider />
    </div>
  )
}

export default CustomersListItem;
