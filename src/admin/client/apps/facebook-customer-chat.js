import React from 'react'
import messages from 'lib/text'
import api from 'lib/api'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

export const Description = {
  key: 'facebook-customer-chat',
  name: 'Facebook Customer Chat',
  coverUrl: '/admin-assets/images/apps/messenger.png',
  description: `<p>The Messenger Platform's customer chat plugin allows you to integrate your Messenger experience directly into your website. This allows your customers to interact with your business anytime with the same personalized, rich-media experience they get in Messenger.</p>
  <p><img src='/admin-assets/images/apps/facebook-customer-chat-plugin.png' /></p>
  <p>The customer chat plugin automatically loads recent chat history between the person and your business, meaning recent interactions with your business on messenger.com, in the Messenger app, or in the customer chat plugin on your website will be visible. This helps create a single experience for your customers, and enables you to continue the conversation even after they have left your webpage. No need to capture their information to follow up, just use the same conversation in Messenger.</p>
  <p>To access your Facebook's Page ID:</p>
  <ol>
    <li>Open your Facebook page.</li>
    <li>Click the About tab.</li>
    <li>Scroll down to the bottom of the Page Info section.</li>
    <li>Next to Facebook Page ID, you can find your page ID.</li>
  </ol>`
};

const CHAT_CODE = `<div class="fb-customerchat" page_id="PAGE_ID" minimized="IS_MINIMIZED"></div>`;

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageId: '',
      minimized: 'false'
    };
  }

  handlePageIdChange = event => {
    this.setState({ pageId: event.target.value });
  };

  handleMinimizedChange = event => {
    this.setState({ minimized: event.target.value });
  };

  fetchSettings = () => {
    api.apps.settings.retrieve('facebook-customer-chat')
    .then(({status, json}) => {
      const appSettings = json;
      if(appSettings){
        this.setState({
          pageId: appSettings.pageId,
          minimized: appSettings.minimized
        });
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  updateSettings = () => {
    const { pageId, minimized } = this.state;
    const htmlCode = pageId && pageId.length > 0 ? CHAT_CODE.replace(/PAGE_ID/g, pageId).replace(/IS_MINIMIZED/g, minimized) : '';

    api.apps.settings.update('facebook-customer-chat', { pageId: pageId, minimized: minimized });
    api.theme.placeholders.update('facebook-customer-chat', {
      place: 'body_end',
      value: htmlCode
    });
  }

  componentDidMount() {
    this.fetchSettings()
  }

  render() {
    return (
      <div>
        <TextField
          type="text"
          fullWidth={true}
          value={this.state.pageId}
          onChange={this.handlePageIdChange}
          floatingLabelText="Page ID"
        />

        <TextField
          type="text"
          fullWidth={true}
          value={this.state.minimized}
          onChange={this.handleMinimizedChange}
          floatingLabelText="minimized"
          hintText="false"
        />

        <div style={{ textAlign: 'right' }}>
          <RaisedButton
            label={messages.save}
            primary={true}
            disabled={false}
            onClick={this.updateSettings}
          />
        </div>
      </div>
    )
  }
}
