import React from 'react'
import Toggle from 'material-ui/Toggle';

export const CustomToggle = ({ input, label, className }) => (
  <Toggle
    label={label}
    toggled={input.value ? true : false}
    onToggle={input.onChange}
    className={className}
  />
)
