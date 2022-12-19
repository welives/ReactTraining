import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'
import PropTypes from 'prop-types'

WangEditor.propTypes = {
  html: PropTypes.string,
  setHtml: PropTypes.func,
}

WangEditor.defaultProps = {
  html: '',
  setHtml: () => {},
}

/**
 * 封装wangEditor， 通过父组件传入的props进行修改富文本内容
 * @param {Object} props
 * @returns
 */
function WangEditor({ html, setHtml }, ref) {
  const [editor, setEditor] = useState(null) // 存储 editor 实例

  const toolbarConfig = {}
  const editorConfig = {
    placeholder: '请输入内容...',
    autoFocus: false,
    onCreated: (editor) => {
      setEditor(editor)
    },
    onChange: (editor) => {
      setHtml(editor.getHtml())
    },
  }
  // 通过 useImperativeHandle 把子组件的方法暴露给父组件
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (editor == null) return
      editor.focus()
    },
  }))

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])
  return (
    <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: '15px' }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        value={html}
        defaultConfig={editorConfig}
        mode="default"
        style={{ height: '300px', overflowY: 'hidden' }}
      />
    </div>
  )
}
export default React.forwardRef(WangEditor)
