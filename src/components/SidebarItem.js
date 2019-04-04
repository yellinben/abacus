import React from 'react';
import { Link } from "react-router-dom";

const SidebarItem = (props) => {
  const {doc} = props;
  return (
    <li>
      <Link to={`/documents/${doc.id}`}>
        {doc.title}
      </Link>
    </li>
  );
}

export default SidebarItem;
