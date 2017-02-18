import React from 'react'
import PaymentsEdit from 'modules/settings/paymentsEdit'

export default({params}) => (
  <PaymentsEdit methodId={params.id} />
)
