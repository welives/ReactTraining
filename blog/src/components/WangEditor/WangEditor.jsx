import React from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'
import PropTypes from 'prop-types'

/**
 * 封装wangEditor， 通过父组件传入的props进行修改富文本内容
 * @param {Object} props
 * @returns
 */
class WangEditor extends React.Component {
  toolbarConfig = {}

  editorConfig = {
    placeholder: '请输入内容...',
    autoFocus: false,
    onCreated: (editor) => {
      this.setState({ editor })
    },
    onChange: (editor) => {
      this.props.setHtml(editor.getHtml())
    },
  }

  constructor(props) {
    super(props)
    this.state = {
      editor: null,
    }
    this.setFocus = this.setFocus.bind(this)
  }

  setFocus() {
    if (this.state.editor == null) return
    this.state.editor.focus()
  }

  // 及时销毁 editor
  componentWillUnmount() {
    if (this.state.editor == null) return
    this.state.editor.destroy()
    this.setState({ editor: null })
  }

  render() {
    return (
      <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: '15px' }}>
        <Toolbar
          editor={this.state.editor}
          defaultConfig={this.toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          value={this.props.html}
          defaultConfig={this.editorConfig}
          mode="default"
          style={{ height: '300px', overflowY: 'hidden' }}
        />
      </div>
    )
  }
}

WangEditor.propTypes = {
  html: PropTypes.string,
  setHtml: PropTypes.func,
}

WangEditor.defaultProps = {
  html: '',
  setHtml: () => {},
}

export default WangEditor
