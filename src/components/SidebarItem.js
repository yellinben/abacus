import React from 'react';
import { Link } from "react-router-dom";

const SidebarItem = (props) => {
  const {doc} = props;
  return (
    <li>
      <a href={`/documents/${doc.id}`}>{doc.title}</a>
    </li>
  );
}

export default SidebarItem;
