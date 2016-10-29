import React from 'react'
import Login from 'modules/app/login'

// import {deepPurple500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  palette: {
    // textColor: deepPurple500,
  },
  appBar: {
    //height: 50,
  },
});

export default () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="row col-full-height center-xs middle-xs">
      <div className="col-xs-10 col-sm-6 col-md-5 col-lg-4">
        <Login />
      </div>
    </div>
  </MuiThemeProvider>
)
