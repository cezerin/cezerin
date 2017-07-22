import {fetchSettings, installReceive} from 'modules/settings/actions'
import {fetchOrders} from 'modules/orders/actions'

const THEME_INSTALLED = 'theme-installed';
const ORDER_RECEIVED = 'order-received';
const ORDER_CHANGED = 'order-changed';

const messageReceived = (message, store) => {
  switch(message.type){
    case THEME_INSTALLED:
      store.dispatch(installReceive());
      break;
    case ORDER_RECEIVED:
      store.dispatch(fetchOrders());
      break;
    default:
      break;
  }
}

export const listenEvents = (store) => {
  const eventsUrl = '/api/dashboard/events?token=' + localStorage.getItem('dashboard_token');
  const serverEvents = new EventSource(eventsUrl);

  serverEvents.onmessage = (e) => {
    if(e.origin === location.origin && e.isTrusted === true){
      const message = JSON.parse(e.data);
      messageReceived(message, store);
    } else {
      console.log('Received message from server: ' + e.origin);
    }
  }
}
