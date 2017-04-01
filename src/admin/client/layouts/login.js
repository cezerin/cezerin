import React from 'react'
import Login from 'modules/app/login'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default() => (
  <MuiThemeProvider>
    <div className="row col-full-height center-xs middle-xs">
      <div className="col-xs-12 col-sm-8 col-md-6 col-lg-4">
        <Login/>
      </div>
    </div>
  </MuiThemeProvider>
)
