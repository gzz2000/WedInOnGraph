import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Space, Alert, Typography, Button, Input, List, Modal, notification } from 'antd';
import { Link } from "react-router-dom";
import { ReloadOutlined, UserOutlined, LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined, SmileOutlined } from '@ant-design/icons';
import Service from './service';
import Follow from "./utils"
import { useRef } from 'react';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Home = () => {
  const [content, setContent] = useState("");
  const [user, setUser] = useState("");
  const [toFollow, setToFollow] = useState([]);
  useEffect(() => {
    const currentUser = Service.getCurrentUser();
    if (currentUser) {
      setUsername(currentUser);
      Service.get2HopUnfollow(currentUser).then( res => { setToFollow(res); } );
    }
  })

  const [api, contextHolder] = notification.useNotification();
  const HandlePost = () => {
    if(!user)
      Modal.warning({
        title: 'Please log in or register first!',
        icon: <SmileOutlined/>
      });
      // api.info({
      //   message: "Post failed!",
      //   description: "<Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>",
      //   // icon: (
      //   //   <SmileOutlined
      //   //     style={{
      //   //       color: '#108ee9',
      //   //     }}
      //   //   />)
      // });
    else if(!content)
      Modal.warning({
        title: 'Say something!',
        icon: <SmileOutlined/>
      });
    else
      Modal.confirm({
        title: 'Sure to post?',
        icon: <ExclamationCircleOutlined/>,
        content: '',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          Service.addPost(user, content);
        }
      });
  }

  return (
    <div style={{ width: '1000px' }}>
      <Row style={{ width: '100%' }}>
        <Col span={16} style={{ padding: '20px' }}>
          {!user &&
            <Alert /* "you are exploring..." */
              description={
                <>
                  You are exploring all posts on the server
                  as a guest user.
                  <Link to="/login">Log in</Link> to post your own,
                  and see the activity of the people you follow.
                </>
              }
              type="info"
              showIcon
            />
          }
          <Space
            direction="vertical"
            size="middle"
            style={{ width: '100%' }}
          >
            <Card  /* "say something..." */
              bodyStyle={{ padding: '0px' }}
            >
              <Row style={{ width: '100%' }}>
                <Col span={20}>
                  <TextArea
                    bordered={false}
                    style={{ padding: '15px', fontSize: '16px' }}
                    autoSize={{ minRows: 2 }}
                    onChange= { e => {setContent(e.target.value);} }
                    placeholder="Say something..."
                  />
                </Col>
                <Col span={4}>
                  <Button
                    type="link"
                    icon={<SendOutlined />}
                    style={{ width: '100%', height: '100%' }}
                    onClick={HandlePost}
                  >
                    Post
                  </Button>
                </Col>
              </Row>
            </Card>
            <Title level={3}>
              All Posts
              <Button
                  type="link"
                  icon={<ReloadOutlined />}
              >Refresh</Button>
            </Title>
            <Card
              size="small"
              type="inner"
              title={<><UserOutlined /> <a>gzz</a> (you) </>}
              extra={
                <Button
                  danger={true}
                         style={{ margin: "-4px -15px" }}
                         type="link"
                         icon={<DeleteOutlined />}
                  >Delete</Button>
              }
            >
              <Paragraph
                style={{ fontSize: '16px' }}
              >
                This is a test weibo post! Hit the like button for me!
              </Paragraph>

              <div style={{ marginBottom: '-8px', marginLeft: '-8px' }}>
                <Button type="text" icon={<LikeFilled />} />
                <a>gzz</a> (you), <a>gzz2</a>
              </div>
            </Card>

            <Card
              size="small"
              type="inner"
              title={<><UserOutlined /> <a>gzz2</a></>}
            >
              <Paragraph
                style={{ fontSize: '16px' }}
              >
                This is a test weibo post by another person.
              </Paragraph>
              <div style={{ marginBottom: '-8px', marginLeft: '-8px' }}>
                <Button type="text" icon={<LikeOutlined />} />
                <Text italic>Be the first one to like this!</Text>
              </div>
            </Card>
          </Space>

        </Col>

        <Col span={8} style={{ padding: '20px', paddingLeft: '0px' }}>
          <Card title="Person To Follow" bodyStyle={{ padding: '0px' }}>
            <List
              itemLayout="horizontal"
              dataSource={toFollow}
              renderItem={other =>
                <List.Item extra={
                  <Follow me={user} other={other["name"]}/>
                } >
                  <div>
                    <UserOutlined /> <b>{other["name"]}</b><br />
                    Followed by {other["agent"]}
                  </div>
                </List.Item>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home;
