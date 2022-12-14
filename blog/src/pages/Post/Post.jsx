import React from 'react'
import { Avatar } from 'antd'
import { AiFillEdit, AiOutlineDelete } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import Recommend from '../../components/Recommend/Recommend'
import { Container, ContentBox, ImageBox } from './style'
import avatarImg from '../../assets/img/avatar.jpg'

export default function Post() {
  return (
    <section>
      <Container className="container">
        <ContentBox>
          <ImageBox top={50}>
            <img
              src="https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt=""
            />
          </ImageBox>
          <div className="user">
            <Avatar src={avatarImg} />
            <div>
              <h6>Jandan</h6>
              <span>发布于两天前</span>
            </div>
            <div className="edit">
              <Link>
                <AiFillEdit />
              </Link>
              <AiOutlineDelete />
            </div>
          </div>
          <div className="content">
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1>
            <div>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure
                animi sequi excepturi enim atque ullam neque voluptates incidunt
                ea quia repellat dolore aliquid voluptatibus libero earum ipsa,
                officiis natus officia.
              </p>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Similique voluptate eveniet incidunt atque aut, hic nostrum
                facilis, sequi, sunt fuga asperiores accusantium nobis? Culpa
                officia earum ullam numquam fugiat officiis?
              </p>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis,
                atque voluptates ut deserunt ea commodi consectetur vel
                consequatur explicabo quibusdam magni laboriosam recusandae non
                aliquid? Natus hic unde velit doloremque.
              </p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Expedita consectetur quos soluta sequi. Suscipit consequuntur
                corporis nisi neque reprehenderit voluptate perspiciatis! Quod,
                dignissimos perferendis. Dignissimos quidem recusandae illum
                optio suscipit!
              </p>
            </div>
          </div>
        </ContentBox>
        <Recommend />
      </Container>
    </section>
  )
}
