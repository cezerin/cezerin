import React from 'react'

const Breadcrumbs = ({ links }) => (
  <ul>
    {links.map(link => (
        <li>{link.title}</li>
    ))}
  </ul>
)

export default Breadcrumbs
