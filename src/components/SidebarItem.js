import React, { Component } from 'react'

const SidebarItem = (props) => {
  const {doc} = props;
  return (
    <li>{doc.title}</li>
  );
}

export default SidebarItem;
