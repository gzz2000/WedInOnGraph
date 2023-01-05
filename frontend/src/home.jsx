import React from 'react';
import { Row, Col, Card, Space, Alert, Typography, Button, Input, List } from 'antd';
import { Link } from "react-router-dom";
import { UserOutlined, LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Home = () => {
  return (
    <div style={{ width: '1000px' }}>
      <Row style={{ width: '100%' }}>
        <Col span={16} style={{ padding: '20px' }}>
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
                    placeholder="Say something..."
                  />
                </Col>
                <Col span={4}>
                  <Button
                    type="link"
                    icon={<SendOutlined />}
                    style={{ width: '100%', height: '100%' }}
                  >
                    Post
                  </Button>
                </Col>
              </Row>
            </Card>

            <Title level={3}>All Posts</Title>
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
              dataSource={['gzz3', 'gzz4']}
              renderItem={user =>
                <List.Item extra={
                  <Button
                    type="text"
                          size="small"
                          icon={<PlusOutlined />}
                    >Follow</Button>
                } >
                  <div>
                    <UserOutlined /> <b>{user}</b><br />
                    Followed by gzz2
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
