import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'

export default function WangEditor() {
  const [editor, setEditor] = useState(null) // 存储 editor 实例
  const [html, setHtml] = useState('')

  const toolbarConfig = {}
  const editorConfig = {
    placeholder: '请输入内容...',
  }

  const handleEditorChange = (e) => {
    setHtml(e.getHtml())
  }

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
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={handleEditorChange}
        mode="default"
        style={{ height: '300px' }}
      />
    </div>
  )
}
