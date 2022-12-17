import React, { useContext, useEffect, useState } from 'react'
import { Avatar } from 'antd'
import { AiFillEdit, AiOutlineDelete } from 'react-icons/ai'
import { Link, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import Recommend from '../../components/Recommend/Recommend'
import { Container, ContentBox, ImageBox } from './style'
import avatarImg from '../../assets/img/avatar.jpg'
import { AuthContext } from '../../context/authContext'

export default function Post() {
  const { currentUser } = useContext(AuthContext)
  const [recommends, setRecommends] = useState([])
  const [post, setPost] = useState({})
  const location = useLocation()
  const postId = location.pathname.split('/')[2]
  useEffect(() => {
    ;(async () => {
      let data = await fetch(`/post/${postId}`).then((res) => res.json())
      if (data.status === 'success') {
        setPost(data.result.data)
        const { id, uid, category_id } = data.result.data
        const url = `/post/recommend?id=${id}&uid=${uid}&cid=${category_id}`
        data = await fetch(url).then((res) => res.json())
        setRecommends(data.result.data)
      }
    })()
  }, [postId])
  const handleDeletePost = async (e) => {
    await fetch(`/post/${e.target.dataset.id}`, { method: 'DELETE' }).then(
      (res) => res.json()
    )
  }
  return (
    <section>
      <Container className="container">
        <ContentBox>
          <ImageBox top={50}>
            <img src={post.cover} alt="" />
          </ImageBox>
          <div className="user">
            <Avatar src={avatarImg} />
            <div>
              <h6>{post.author}</h6>
              <span>发布于 {dayjs(post.created_at).fromNow()}</span>
            </div>
            {currentUser && currentUser.id === post.uid && (
              <div className="edit">
                <Link to={`/publish?edit=${post.id}`} state={post}>
                  <AiFillEdit />
                </Link>
                <AiOutlineDelete onClick={handleDeletePost} data-id={post.id} />
              </div>
            )}
          </div>
          <div className="content">
            <h1>{post.title}</h1>
            <div>{post.content}</div>
          </div>
        </ContentBox>
        <Recommend posts={recommends} />
      </Container>
    </section>
  )
}
