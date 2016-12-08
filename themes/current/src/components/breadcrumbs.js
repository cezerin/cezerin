import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Breadcrumbs = ({ links }) => (
  <Breadcrumb>
    <LinkContainer to="/">
      <Breadcrumb.Item>Home</Breadcrumb.Item>
    </LinkContainer>
    {links.map(link => (
      <LinkContainer key={link.path} to={link.path}>
        <Breadcrumb.Item>{link.title}</Breadcrumb.Item>
      </LinkContainer>
    ))}
  </Breadcrumb>
)

export default Breadcrumbs
