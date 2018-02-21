import messages from 'lib/text'
import settings from 'lib/settings'
import {installReceive} from 'modules/settings/actions'
import {fetchOrders} from 'modules/orders/actions'

const ORDER_CREATED = 'order.created';
const THEME_INSTALLED = 'theme.installed';
let store = null;

export const connectToWebSocket = (reduxStore) => {
  store = reduxStore;
  const wsUrl = settings.apiWebSocketUrl;
  const token = localStorage.getItem('dashboard_token');
  const ws = new WebSocket(`${wsUrl}/dashboard?token=${token}`);

  ws.onmessage = onMessage;
  ws.onopen = onOpen;
  ws.onerror = onError;
}

const onMessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    eventHandler(message);
  } catch (err) {}
};

const onOpen = () => {};

const onError = (error) => {
  console.log(error);
};

const showNotification = (title, body, requireInteraction = false) => {
  let msg = new Notification(title, {
    body: body,
    tag: 'dashboard',
    requireInteraction: requireInteraction
  });

  msg.addEventListener("click", (event) => {
    parent.focus();
    event.target.close();
  });
}

const eventHandler = ({ event, payload }) => {
  switch(event){
    case THEME_INSTALLED:
      const fileName = payload;
      store.dispatch(installReceive());
      showNotification(messages.settings_theme, messages.themeInstalled);
      break;
    case ORDER_CREATED:
      const order = payload;
      store.dispatch(fetchOrders());
      showNotification(`${messages.order} #${order.number}`, `${order.shipping_address.full_name}, ${order.shipping_address.city}`, true);
      break;
    default:
      break;
  }
}
