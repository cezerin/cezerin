// General setting to insert into the DB

export default settings = {
  domain: 'http://localhost:3000',
  logo_file: null,
  language: 'es',
  currency_code: 'CLP',
  currency_symbol: '$',
  currency_format: '${amount}',
  thousand_separator: '.',
  decimal_separator: ',',
  decimal_number: 2,
  timezone: 'America/Santiago',
  date_format: 'D MMMM, YYYY',
  time_format: 'h:mm a',
  default_shipping_country: 'CL',
  default_shipping_state: 'Santiago',
  default_shipping_city: 'Santiago',
  default_product_sorting: 'stock_status,price,position',
  weight_unit: 'kg',
  length_unit: 'cm',
  hide_billing_address: false
}
