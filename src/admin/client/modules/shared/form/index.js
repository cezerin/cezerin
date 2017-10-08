import React from 'react';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';

export const CustomToggle = ({ input, label, className = '', disabled = false, style }) => {
  return (
    <Toggle
      label={label}
      toggled={input.value ? true : false}
      onToggle={(event, isInputChecked) => {
        input.onChange(isInputChecked)
      }}
      className={className}
      disabled={disabled}
      style={style}
    />
  )
}

export const NumberField = ({ input, label, className = '', disabled = false, style }) => (
  <TextField
    floatingLabelText={label}
    fullWidth={true}
    disabled={disabled}
    value={input.value}
    type="number"
    onChange={(event, value) => {
      let number = parseFloat(value);
      number = number ? number : 0;
      input.onChange(number)
    }}
  />
)

export const ColorField = ({ input, meta: { touched, error } }) => (
  <input {...input} type="color"/>
)
