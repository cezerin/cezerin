import React from 'react'

import messages from 'src/locales'
import style from './style.css'
import settings from 'lib/settings'
import api from 'lib/api'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const styles = {
  button: {
    margin: 12
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
  }
};

export default class Themes extends React.Component {
  constructor(props) {
    super(props)
  }

  onExportClick() {
    this.props.exportRequest();
    api.themes.exportCurrent().then(({satus, json}) => {
      this.props.exportReceive();
      if(json.file) {
        window.location = json.file;
      } else {
        alert('Error: ' + JSON.stringify(json));
      }
    });
  }

  onImportFileChoose(e) {
    this.props.installRequest();
    const file = e.target.files[0];
    var formData = new FormData();
    formData.append('file', file);

    api.themes.importAndInstall(formData).then(({satus, json}) => {
      this.props.installReceive();
      if(json.success) {
        alert('success');
      } else {
        alert('Error: ' + JSON.stringify(json));
      }
    });
  }

  render() {
    const {exportInProcess, installInProcess} = this.props;

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
        <Paper className={style.form} zDepth={1}>
          <div className={style.innerBox}>

            <div className="row between-xs middle-xs">
              <div className="col-xs-6">{messages.settings.themeExportDesciption}</div>
              <div className="col-xs-4" style={{ textAlign: 'right' }}>
                <RaisedButton label={exportInProcess ? messages.settings.themeExporting : messages.settings.themeExport} disabled={exportInProcess} onTouchTap={this.onExportClick.bind(this)}/>
              </div>
            </div>

            <Divider style={{ marginTop: 30, marginBottom: 30 }} />

            <div className="row between-xs middle-xs">
              <div className="col-xs-6">{messages.settings.themeInstallDesciption}</div>
              <div className="col-xs-4" style={{ textAlign: 'right' }}>
                <RaisedButton label={installInProcess ? messages.settings.themeInstalling : messages.settings.themeInstall} disabled={installInProcess} labelPosition="before" containerElement="label">
                  <input type="file" onChange={this.onImportFileChoose.bind(this)} style={styles.exampleImageInput}/>
                </RaisedButton>
              </div>
            </div>

            <Divider style={{ marginTop: 30, marginBottom: 30 }} />

          </div>
        </Paper>
      </div>
    )
  }
}
