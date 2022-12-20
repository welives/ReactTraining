import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, ImageBox } from './style'

Recommend.propTypes = {
  posts: PropTypes.instanceOf(Array),
}

Recommend.defaultProps = {
  posts: [],
}

/**
 * 获取图片真实url
 * @param {String} path
 * @returns
 */
const getImagePath = (path) => {
  if (!path) return ''
  return path.match(/^http(s)?/g) ? path : process.env.REACT_APP_CDN + path
}

export default function Recommend({ posts }) {
  return (
    <Container>
      <h3>相关推荐</h3>
      <div className="list">
        {posts.map((el) => (
          <div className="item" key={el.id}>
            <Link to={`/post/${el.id}`}>
              <ImageBox top={70}>
                {el.cover && <img src={getImagePath(el.cover)} alt="" />}
              </ImageBox>
            </Link>
            <h2>{el.title}</h2>
          </div>
        ))}
      </div>
    </Container>
  )
}
