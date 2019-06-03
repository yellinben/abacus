import React from 'react';

const SidebarItem = ({sheet}) => {
  return (
    <li>
      <a href={`/sheets/${sheet.id}`}>
        {sheet.title}
      </a>
    </li>
  );
}

export default SidebarItem;
