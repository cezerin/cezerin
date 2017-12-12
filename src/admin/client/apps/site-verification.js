import React from 'react'
import messages from 'lib/text'
import api from 'lib/api'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

export const Description = {
  key: 'site-verification',
  name: 'Site Verification',
  coverUrl: '/admin-assets/images/apps/site_verification.png',
  description: `Note that verifying your site with these services is not necessary in order for your site to be indexed by search engines. To use these advanced search engine tools and verify your site with a service, paste the HTML Tag code below.
  <p>Supported verification services:</p>
  <ol>
    <li><a target="_blank" href="https://www.google.com/webmasters/tools/" rel="external noopener noreferrer">Google Search Console</a></li>
    <li><a target="_blank" href="https://www.bing.com/webmaster/" rel="external noopener noreferrer">Bing Webmaster Center</a></li>
    <li><a target="_blank" href="https://pinterest.com/website/verify/" rel="external noopener noreferrer">Pinterest Site Verification</a></li>
    <li><a target="_blank" href="https://webmaster.yandex.com/sites/" rel="external noopener noreferrer">Yandex.Webmaster</a></li>
  </ol>`
};

const GOOGLE_EXAMPLE = '<meta name="google-site-verification" content="1234" />';
const BING_EXAMPLE = '<meta name="msvalidate.01" content="1234" />';
const PINTEREST_EXAMPLE = '<meta name="p:domain_verify" content="1234" />';
const YANDEX_EXAMPLE = '<meta name="yandex-verification" content="1234" />';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      google: '',
      bing: '',
      pinterest: '',
      yandex: ''
    };
  }

  handleGoogleChange = (event) => {
    this.setState({
      google: event.target.value
    });
  }

  handleBingChange = (event) => {
    this.setState({
      bing: event.target.value
    });
  }

  handlePinterestChange = (event) => {
    this.setState({
      pinterest: event.target.value
    });
  }

  handleYandexChange = (event) => {
    this.setState({
      yandex: event.target.value
    });
  }

  fetchSettings = () => {
    api.apps.settings.retrieve('site-verification')
    .then(({status, json}) => {
      const appSettings = json;
      if(appSettings){
        this.setState({
          google: appSettings.google,
          bing: appSettings.bing,
          pinterest: appSettings.pinterest,
          yandex: appSettings.yandex
        });
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  updateSettings = () => {
    const {google, bing, pinterest, yandex} = this.state;
    const metaTags = [google, bing, pinterest, yandex]
      .map(tag => tag && tag.length > 0 ? tag : null)
      .filter(tag => tag !== null)
      .join('\n');

    api.apps.settings.update('site-verification', {
      google: google,
      bing: bing,
      pinterest: pinterest,
      yandex: yandex
    });

    api.theme.placeholders.update('site-verification', {
      place: 'head_start',
      value: metaTags
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
          value={this.state.google}
          onChange={this.handleGoogleChange}
          floatingLabelText="Google"
          fullWidth={true}
          hintText={GOOGLE_EXAMPLE}
        />

        <TextField
          type="text"
          value={this.state.bing}
          onChange={this.handleBingChange}
          floatingLabelText="Bing"
          fullWidth={true}
          hintText={BING_EXAMPLE}
        />

        <TextField
          type="text"
          value={this.state.pinterest}
          onChange={this.handlePinterestChange}
          floatingLabelText="Pinterest"
          fullWidth={true}
          hintText={PINTEREST_EXAMPLE}
        />

        <TextField
          type="text"
          value={this.state.yandex}
          onChange={this.handleYandexChange}
          floatingLabelText="Yandex"
          fullWidth={true}
          hintText={YANDEX_EXAMPLE}
        />

        <div style={{ textAlign: 'right', marginTop: 20 }}>
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
