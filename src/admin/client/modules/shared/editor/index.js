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

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.input.value
    }
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.input.value) {
      this.setState({
        value: nextProps.input.value
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.value !== nextProps.input.value;
  }

  onChange = (e) => {
    const content = e.target.getContent();
    this.setState({ value: content });
    this.props.input.onChange(content);
  }

  render() {
    return (
      <TinyMCE
        content={this.state.value}
        config={{
          language: settings.language,
          themes: config.themes,
          inline: config.inline,
          plugins: config.plugins,
          toolbar1: config.toolbar1,
          toolbar2: config.toolbar2,
          menubar: false
        }}
        onChange={this.onChange}
      />
    )
  }
}
