import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'antd'
import { Container, PostItem } from './style'

export default function Home() {
  const [posts, setPosts] = useState([])
  const location = useLocation()
  const category = location.search
  useEffect(() => {
    ;(async () => {
      const data = await fetch(`/post/list${category}`).then((res) =>
        res.json()
      )
      if (data.status === 'success') {
        setPosts(data.result.data)
      }
    })()
  }, [category])

  return (
    <section>
      <Container className="container">
        {posts.map((el, index) => (
          <PostItem key={el.id}>
            <div className="imgBox">
              <img src={el.cover} alt="" />
            </div>
            <div className="content">
              <Link to={`/post/${el.id}`}>
                <h1>{el.title}</h1>
              </Link>
              <p>{el.content}</p>
              <Link className="view" to={`/post/${el.id}`}>
                <Button type="primary">查看详情</Button>
              </Link>
            </div>
          </PostItem>
        ))}
      </Container>
    </section>
  )
}
