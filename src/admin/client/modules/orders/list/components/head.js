import React from 'react';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import messages from 'lib/text';

export default ({ onSelectAll }) => (
	<Subheader style={{ paddingRight: 16 }}>
		<div className="row middle-xs">
			<div className="col-xs-1">
				<Checkbox
					onCheck={(event, isInputChecked) => {
						onSelectAll(isInputChecked);
					}}
				/>
			</div>
			<div className="col-xs-1" />
			<div className="col-xs-2">{messages.order}</div>
			<div className="col-xs-4">{messages.orders_shippingTo}</div>
			<div className="col-xs-2" style={{ textAlign: 'right' }}>
				{messages.orders_total}
			</div>
			<div
				className="col-xs-2"
				style={{ textAlign: 'right', paddingRight: 16 }}
			>
				{messages.orders_status}
			</div>
		</div>
	</Subheader>
);
