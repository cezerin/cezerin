import React from 'react'

import ImageUpload from 'modules/shared/imageUpload'
import settings from 'lib/settings'
import api from 'lib/api'

import Paper from 'material-ui/Paper';

export default class GeneralLogoSettingsForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const apiToken = api.token;

    const {onImageUpload, onImageDelete } = this.props;
    let settingsData = this.props.settings;


    let imageUrl = settingsData && settingsData.logo ? settingsData.logo : '';

    return (
        <Paper className="paper-box" zDepth={1}>
          <div style={{ padding: 30 }}>
            <ImageUpload
              imageUrl={imageUrl}
              postUrl={`${settings.apiBaseUrl}/settings/logo`}
              apiToken={apiToken}
              onDelete={onImageDelete}
              onUpload={onImageUpload}
             />
          </div>
          </Paper>
    )
  }
}
