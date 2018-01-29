import React from 'react'
import messages from 'lib/text'
import api from 'lib/api'
import BarChart from './barChart'
import * as utils from './utils'
import moment from 'moment'

export default class OrdersBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersData: null,
      salesData: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const filter = {
      draft: false,
      cancelled: false,
      date_placed_min: moment().subtract(1, 'months').hour(0).minute(0).second(0).toISOString()
    };

    api.orders.list(filter).then(({status, json}) => {
      const reportData = utils.getReportDataFromOrders(json);
      const ordersData = utils.getOrdersDataFromReportData(reportData);
      const salesData = utils.getSalesDataFromReportData(reportData);
      this.setState({ ordersData, salesData });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const { ordersData, salesData } = this.state;
    return (
      <div>
        <BarChart
          data={ordersData}
          legendDisplay={true}
          title={messages.drawer_orders}
        />
        <BarChart
          data={salesData}
          legendDisplay={false}
          title={messages.salesReport}
        />
      </div>
    )
  }
}
