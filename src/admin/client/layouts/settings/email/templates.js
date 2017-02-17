import React from 'react'
import EmailTemplates from 'modules/settings/emailTemplates'

export default({ params }) => (
  <EmailTemplates templateName={params.templateName} />
)
