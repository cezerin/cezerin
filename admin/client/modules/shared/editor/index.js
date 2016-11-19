import React from 'react'
import TinyMCE from 'react-tinymce';
import settings from 'lib/settings'

const Editor = ({ input: { onChange, value } }) =>
  <TinyMCE
    content={value}
    config={{
      language: settings.language,
      themes: settings.editor.themes,
      inline: settings.editor.inline,
      plugins: settings.editor.plugins,
      toolbar1: settings.editor.toolbar1,
      toolbar2: settings.editor.toolbar2,
      menubar: false
    }}
    onChange={e => {onChange(e.target.getContent())}}
  />

export default Editor
