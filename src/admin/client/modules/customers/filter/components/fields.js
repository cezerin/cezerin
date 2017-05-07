import React from 'react';
import messages from 'lib/text'
import style from './style.css'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';

export default ({ active, discontinued, on_sale, stock_status,
  setActive, setDiscontinued, setOnSale, setStock }) => {
  return (
    <div className={style.filter}>
      <Toggle
        label={messages.products_onlyEnabled}
        onToggle={(e, value) => { setActive(value) }}
        toggled={active}
        className={style.toggle}
      />
      <Toggle
        label={messages.products_onlyDiscontinued}
        onToggle={(e, value) => { setDiscontinued(value) }}
        toggled={discontinued}
        className={style.toggle}
      />
      <Toggle
        label={messages.products_onlyOnSale}
        onToggle={(e, value) => { setOnSale(value) }}
        toggled={on_sale}
        className={style.toggle}
      />
      <SelectField
        value={stock_status}
        onChange={(event, index, value) => { setStock(value) }}
        floatingLabelText={messages.products_stockStatus}
        fullWidth={true}
      >
        <MenuItem value={"all"} primaryText={messages.all} />
        <MenuItem value={"available"} primaryText={messages.products_inStock} />
        <MenuItem value={"out_of_stock"} primaryText={messages.products_outOfStock} />
        <MenuItem value={"backorder"} primaryText={messages.products_backorder} />
        <MenuItem value={"preorder"} primaryText={messages.products_preorder} />
        <MenuItem value={"discontinued"} primaryText={messages.products_discontinued} />
      </SelectField>
    </div>
  )
}
