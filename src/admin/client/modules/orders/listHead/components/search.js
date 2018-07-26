import React from 'react';
import messages from 'lib/text';
import TextField from 'material-ui/TextField';

export default ({ value, setSearch }) => {
	return (
		<TextField
			className="searchField"
			value={value}
			onChange={(e, v) => {
				setSearch(v);
			}}
			hintText={messages.orders_search}
			underlineShow={false}
			hintStyle={{ color: 'rgba(255,255,255,0.4)', textIndent: '16px' }}
			inputStyle={{
				color: '#fff',
				backgroundColor: 'rgba(255,255,255,0.2)',
				borderRadius: '4px',
				textIndent: '16px'
			}}
		/>
	);
};
