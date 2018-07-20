import messages from 'lib/text';
import moment from 'moment';

const chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

const transparentize = (color, opacity) => {
	const alpha = opacity === undefined ? 0.5 : 1 - opacity;
	return Color(color)
		.alpha(alpha)
		.rgbString();
};

const getOrdersByDate = (orders, dateMoment) => {
	return orders.filter(order =>
		moment(order.date_placed).isSame(dateMoment, 'day')
	);
};

const filterSuccessOrders = order =>
	order.paid === true || order.closed === true;
const filterNewOrders = order => !order.paid && !order.closed;

export const getReportDataFromOrders = ordersResponse => {
	let reportItems = [];
	let dateFrom = moment().subtract(1, 'months');
	let dateTo = moment();
	const daysDiff = dateFrom.diff(dateTo, 'days');

	for (let i = daysDiff; i < 1; i++) {
		const reportingDate = moment().add(i, 'days');
		const ordersPlacedThisDate = getOrdersByDate(
			ordersResponse.data,
			reportingDate
		);
		const totalOrdersCount = ordersPlacedThisDate.length;
		const successOrdersCount = ordersPlacedThisDate.filter(filterSuccessOrders)
			.length;
		const newOrdersCount = ordersPlacedThisDate.filter(filterNewOrders).length;
		const successOrdersRevenue = ordersPlacedThisDate
			.filter(filterSuccessOrders)
			.reduce((a, b) => {
				return a + b.grand_total;
			}, 0);

		reportItems.push({
			date: reportingDate.format('D MMM'),
			total: totalOrdersCount,
			success: successOrdersCount,
			new: newOrdersCount,
			revenue: successOrdersRevenue
		});
	}

	return reportItems;
};

export const getOrdersDataFromReportData = reportData => {
	const labels = reportData.map(item => item.date);
	const successData = reportData.map(item => item.success);
	const newData = reportData.map(item => item.new);

	return {
		labels: labels,
		datasets: [
			{
				label: messages.closedAndPaidOrders,
				data: successData,
				backgroundColor: chartColors.blue,
				hoverBackgroundColor: transparentize(chartColors.blue, 0.4)
			},
			{
				label: messages.newOrders,
				data: newData,
				backgroundColor: chartColors.yellow,
				hoverBackgroundColor: transparentize(chartColors.yellow, 0.4)
			}
		]
	};
};

export const getSalesDataFromReportData = reportData => {
	const labels = reportData.map(item => item.date);
	const revenueData = reportData.map(item => item.revenue);

	return {
		labels: labels,
		datasets: [
			{
				label: messages.closedAndPaidOrders,
				data: revenueData,
				backgroundColor: chartColors.blue,
				hoverBackgroundColor: transparentize(chartColors.blue, 0.4)
			}
		]
	};
};
