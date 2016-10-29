import React from 'react'
import Head from 'modules/app/head'

// import {deepPurple500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    // textColor: deepPurple500,
  },
  appBar: {
    //height: 50,
  },
});

const Layout = ({ children }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div id="container">
      <div id="headContainer">
        <Head />
      </div>
      <div id="bodyContainer">
        {children}
      </div>
    </div>
  </MuiThemeProvider>
)

Layout.propTypes = {
  children: React.PropTypes.element.isRequired
}
export default Layout
