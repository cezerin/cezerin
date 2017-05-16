import React from 'react'
import Toggle from 'material-ui/Toggle';

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
