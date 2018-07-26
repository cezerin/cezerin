import React from 'react';
import OrdersBar from 'modules/reports/ordersBar';
import { defaults } from 'react-chartjs-2';

// Set charts default
defaults.global.responsive = true;
defaults.global.maintainAspectRatio = false;
defaults.global.title.display = false;
defaults.global.legend.position = 'bottom';
defaults.global.legend.labels.boxWidth = 20;
defaults.global.tooltips.mode = 'index';
defaults.global.tooltips.intersect = false;
defaults.global.tooltips.bodySpacing = 8;
defaults.global.tooltips.titleMarginBottom = 16;

export default () => (
	<div className="scroll col-full-height">
		<OrdersBar />
	</div>
);
