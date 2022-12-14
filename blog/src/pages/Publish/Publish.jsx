import React, { useState } from 'react'
import { Button, Input, Select, Upload } from 'antd'
import { AiOutlineLoading, AiOutlinePlus } from 'react-icons/ai'
import WangEditor from '../../components/WangEditor/WangEditor'
import { Container, ContentBox, UploadBox } from './style'

const { Option } = Select

export default function Publish() {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  return (
    <section>
      <Container className="container">
        <ContentBox>
          <div className="titleBox">
            <Input
              className="title"
              placeholder="请输入标题"
              addonBefore="文章标题"
            />
            <div className="category">
              <span>分类</span>
              <Select
                className="select"
                bordered={false}
                style={{ width: '100%' }}
              >
                <Option value="frontend">前端</Option>
                <Option value="backend">后端</Option>
                <Option value="technology">技术</Option>
                <Option value="design">设计</Option>
                <Option value="language">外语</Option>
                <Option value="gossip">杂谈</Option>
              </Select>
            </div>
          </div>
          <WangEditor />
        </ContentBox>
        <UploadBox>
          <p>上传封面图</p>
          <Upload
            name="file"
            className="upload"
            listType="picture-card"
            showUploadList={false}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="cover" />
            ) : (
              <div>
                {loading ? <AiOutlineLoading /> : <AiOutlinePlus />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Button type="primary">发布</Button>
        </UploadBox>
      </Container>
    </section>
  )
}
