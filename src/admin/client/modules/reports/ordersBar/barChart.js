import React from 'react';
import Paper from 'material-ui/Paper';
import { Bar } from 'react-chartjs-2';
import style from './style.css';

const BarChart = ({ data, title, subTitle, legendDisplay }) => (
	<div className="row row--no-gutter">
		<div className="col--no-gutter col-xs-12">
			<Paper className="paper-box" zDepth={1}>
				<div className={style.title}>{title}</div>
				<div className={style.subTitle}>{subTitle}</div>
				<div style={{ padding: 30 }}>
					<Bar
						data={data}
						width={100}
						height={200}
						options={{
							legend: {
								display: legendDisplay
							},
							scales: {
								xAxes: [
									{
										stacked: true,
										barPercentage: 0.99,
										categoryPercentage: 0.99,
										gridLines: {
											display: false,
											drawBorder: false
										},
										ticks: {
											display: true,
											fontColor: 'rgba(0,0,0,0.3)',
											padding: 0
										}
									}
								],
								yAxes: [
									{
										stacked: true,
										gridLines: {
											display: true,
											drawBorder: false,
											color: 'rgba(0,0,0,0.08)'
										},
										ticks: {
											maxTicksLimit: 4,
											display: true,
											padding: 10,
											fontColor: 'rgba(0,0,0,0.3)'
										}
									}
								]
							}
						}}
					/>
				</div>
			</Paper>
		</div>
	</div>
);

export default BarChart;
