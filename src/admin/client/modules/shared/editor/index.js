import React from 'react'
import TinyMCE from 'react-tinymce';
import settings from 'lib/settings'

const config = {
    inline: true,
    themes: 'inlite',
    plugins: [
      'autolink lists link image charmap preview anchor', 'searchreplace visualblocks code fullscreen', 'media table paste code textcolor directionality'
    ],
    toolbar1: 'image media | styleselect | bold italic bullist numlist link alignleft aligncenter alignright alignjustify',
    toolbar2: 'undo redo | forecolor paste removeformat table | outdent indent | preview code'
  }

const Editor = ({ input: { onChange, value } }) =>
  <TinyMCE
    content={value}
    config={{
      language: settings.language,
      themes: config.themes,
      inline: config.inline,
      plugins: config.plugins,
      toolbar1: config.toolbar1,
      toolbar2: config.toolbar2,
      menubar: false
    }}
    onChange={e => {onChange(e.target.getContent())}}
  />

export default Editor
