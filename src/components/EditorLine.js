import React from 'react'

export const EditorLine = (props) => {
  const {line} = props;
  return (
    <div className="editor-line">{line.input}</div>
  )
}