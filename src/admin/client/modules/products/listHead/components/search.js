import React from 'react'
import messages from 'lib/text'
import TextField from 'material-ui/TextField';

export default ({ value, setSearch }) => {
  return (
    <TextField
      value={value}
      onChange={setSearch}
      hintText={messages.products_search}
      underlineShow={false}
      className="searchField"
      hintStyle={{ color: 'rgba(255,255,255,0.4)', textIndent: '16px' }}
      inputStyle={{ color:'#fff', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', textIndent: '16px' }}
    />
  )
}
