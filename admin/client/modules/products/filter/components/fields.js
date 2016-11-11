import React from 'react';
import messages from 'src/locale'
import style from './style.css'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';

export default ({ active, discontinued, on_sale, stock_status,
  setActive, setDiscontinued, setOnSale, setStock }) => {
  return <div>
    <Subheader>{messages.filter}</Subheader>
    <div className={style.filter}>
      <Toggle
        label={messages.products.onlyActive}
        onToggle={(e, value) => { setActive(value) }}
        toggled={active}
        className={style.toggle}
      />
      <Toggle
        label={messages.products.onlyDiscontinued}
        onToggle={(e, value) => { setDiscontinued(value) }}
        toggled={discontinued}
        className={style.toggle}
      />
      <Toggle
        label={messages.products.onlyOnSale}
        onToggle={(e, value) => { setOnSale(value) }}
        toggled={on_sale}
        className={style.toggle}
      />
      <SelectField
        value={stock_status}
        onChange={(event, index, value) => { setStock(value) }}
        floatingLabelText={messages.products.stockStatus}
        fullWidth={true}
      >
        <MenuItem value={"all"} primaryText={messages.all} />
        <MenuItem value={"available"} primaryText={messages.products.inStock} />
        <MenuItem value={"out_of_stock"} primaryText={messages.products.outOfStock} />
        <MenuItem value={"backorder"} primaryText={messages.products.backorder} />
        <MenuItem value={"preorder"} primaryText={messages.products.preorder} />
        <MenuItem value={"discontinued"} primaryText={messages.products.discontinued} />
      </SelectField>
    </div>
  </div>
}
