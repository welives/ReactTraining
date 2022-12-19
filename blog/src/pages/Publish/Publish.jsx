import React, { useEffect, useState, useContext, useRef } from 'react'
import { message, Button, Input, Select, Upload } from 'antd'
import { AiOutlineLoading, AiOutlinePlus } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import WangEditor from '../../components/WangEditor/WangEditor'
import { AuthContext } from '../../context/authContext'
import { Container, ContentBox, UploadBox } from './style'

const { Option } = Select

/**
 * 获取图片的base64编码
 * @param {File} file
 * @param {Function} cb
 */
const getBase64 = (img, cb) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => cb(reader.result))
  reader.readAsDataURL(img)
}

/**
 * 文件上传前钩子
 * @param {File} file
 * @returns
 */
const beforeUpload = (file) => {
  // 限制图片格式
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) message.error('只能上传 jpg/png 格式的图片')
  // 限制图片大小
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) message.error('文件大小不能超过 2MB')
  return isJpgOrPng && isLt2M
}

export default function Publish() {
  const navigate = useNavigate()
  const location = useLocation()
  const editorRef = useRef(null)
  const { state } = location // 编辑状态下的文章详情
  const { showToast } = useContext(AuthContext)
  const [loading, setLoading] = useState(false) // 上传组件的loading状态
  const [imageUrl, setImageUrl] = useState('') // 上传组件的预览链接 base64
  // 表单, 复杂类型的 state 在更新时要使用函数形式
  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    categoryKey: '',
    cover: '', // 上传接口返回的资源地址
    coverUuid: '', // 上传接口返回的资源id
  })
  const [html, setHtml] = useState('') // 富文本专用
  const [cates, setCates] = useState([]) // 分类列表
  // 请求分类列表
  useEffect(() => {
    ;(async () => {
      const data = await fetch('/category/list?pid=0').then((res) => res.json())
      if (data.status === 'success') {
        setCates(data.result.data)
      }
    })()
  }, [])
  // 编辑时的回显监听
  useEffect(() => {
    setForm({
      title: state?.title || '',
      categoryId: state?.category_id || '',
      categoryKey: state?.category_key || '',
      cover: state?.cover || '',
      coverUuid: state?.cover_uuid || '',
    })
    setHtml(state?.content || '')
  }, [state])

  /**
   * 输入框改变事件
   * @param {InputEvent} e
   */
  const handleTitleChange = (e) => {
    setForm({ ...form, title: e.target.value })
  }
  /**
   * 分类改变事件
   * @param {String} e
   */
  const handleCategoryChange = (e) => {
    const cateId = cates.find((el) => el.key === e).id
    setForm({ ...form, categoryId: cateId, categoryKey: e })
  }
  /**
   * 表单校验
   * @returns
   */
  const handleValidation = () => {
    const { title, categoryKey, cover } = form
    if (!title) {
      showToast('请输入标题')
      document.querySelector('input[name="title"]').focus()
      return false
    }
    if (!categoryKey) {
      showToast('请选择分类')
      return false
    }
    if (!html) {
      showToast('请输入文章内容')
      editorRef.current.focus()
      return false
    }
    if (!cover) {
      showToast('请上传封面')
      return false
    }
    return true
  }
  /**
   * 表单提交事件
   * @param {SubmitEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (handleValidation()) {
      const postData = {
        ...form,
        content: html,
      }
      const res = await fetch('/post', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(postData),
      }).then((res) => res.json())
      if (res.status === 'success') {
        showToast(res.message, 'success')
        setTimeout(() => {
          navigate(`/?category=${postData.categoryKey}`)
        }, 500)
      }
    }
  }
  /**
   * 文件状态改变事件
   * @param {Object} e
   * @returns
   */
  const handleFileChange = (e) => {
    if (e.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (e.file.status === 'done') {
      const { save_path: cover, uuid: coverUuid } = e.file.response.result.data
      setForm({ ...form, cover, coverUuid })
      getBase64(e.file.originFileObj, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }
  return (
    <section>
      <Container className="container" onSubmit={handleSubmit}>
        <ContentBox>
          <div className="titleBox">
            <Input
              className="title"
              name="title"
              placeholder="请输入标题"
              addonBefore="文章标题"
              value={form.title}
              onChange={handleTitleChange}
            />
            <div className="category">
              <span>分类</span>
              <Select
                className="select"
                name="category"
                bordered={false}
                style={{ width: '100%' }}
                value={form.categoryKey}
                onChange={handleCategoryChange}
              >
                {cates.map((el) => (
                  <Option key={el.id} value={el.key}>
                    {el.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <WangEditor html={html} setHtml={setHtml} ref={editorRef} />
        </ContentBox>
        <UploadBox>
          <p>上传封面图</p>
          <Upload
            accept=".jpg,.png"
            name="file"
            action="/upload"
            data={{ type: 'image' }}
            className="upload"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="cover" />
            ) : (
              <div>
                {loading ? <AiOutlineLoading /> : <AiOutlinePlus />}
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
          <span className="tips">
            只能上传jpg/png格式图片，且不大小不超过 2MB
          </span>
          <Button type="primary" htmlType="submit">
            发布
          </Button>
        </UploadBox>
      </Container>
    </section>
  )
}
