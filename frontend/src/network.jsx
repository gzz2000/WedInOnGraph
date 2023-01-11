import React, { useState, useEffect } from 'react';
import { List, Space, Layout,Empty, Button, Checkbox, Form, Input, Menu, Typography, Card, Skeleton } from 'antd';
import { CloseOutlined, MinusOutlined, EditOutlined, PlusOutlined, LoginOutlined, UserOutlined, UsergroupAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
const { Search } = Input;
import { Row, Col, Alert,  } from 'antd';
import { Link, useParams } from "react-router-dom";
import { LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import Service from './service';
import { useAuth } from './context_auth';

const { Title, Paragraph, Text } = Typography;

const Network = () => {
  const {user: currentUser} = useAuth();
  const {username} = useParams();
  const [details, setDetails] = useState(null);

  if(details === null) return (
    <div style={{width: '900px', margin: '20px'}}>
      <Skeleton avatar paragraph={{ rows: 4 }} />
    </div>
  );
  
  return (
    <div>
      <Card
        size = "large"
        title={username}
        style={{width: 900, margin: 30}}
      >
        <Paragraph
          style={{ fontSize: '16px' , margin:-5}}
        >
          Email: todo...
        </Paragraph>
      </Card>
      <Row>
        <Col span={12}>
          <Card
            title="They follow me:"
            style={{margin: "0px 30px"}}
            bodyStyle={{ padding: '0px' }}
          >
            {/**
                todo: list of cards
                hint: maybe use .map() in Javascript.
              */}
            <List
              itemLayout="horizontal"
              dataSource={['gzz3', 'gzz4']}
              renderItem={user =>
                <List.Item
                  style={{height: 80}}
                        extra={
                          <Button
                            type="text"
                                  size="small"
                                  danger={true}
                                  icon={<PlusOutlined />}
                            >Follow</Button>
                        } >
                  <div>
                    <UserOutlined /> <b>{user}</b>
                  </div>
                </List.Item>
              }
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="I follow them:"
            style={{margin: "0px 30px"}}
            bodyStyle={{ padding: '0px' }}
          >
            {/**
                todo: list of cards
                hint: maybe use .map() in Javascript.
              */}
            <List
              itemLayout="horizontal"
              dataSource={['gzz3', 'gzz4']}
              renderItem={user =>
                <List.Item
                  style={{height: 80}}
                        extra={
                          <Button
                            type="text"
                                  size="small"
                                  danger={true}
                                  icon={<CloseOutlined />}
                            >Unfollow</Button>
                        } >
                  <div>
                    <UserOutlined /> <b>{user}</b>
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
export default Network;
