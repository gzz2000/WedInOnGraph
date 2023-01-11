import React, { useState, useEffect } from 'react';
import { List, Space, Layout, Button, Checkbox, Form, Input, Menu, Typography, Card, Skeleton, Empty } from 'antd';
import { CloseOutlined, MinusOutlined, EditOutlined, PlusOutlined, LoginOutlined, UserOutlined, UsergroupAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
const { Search } = Input;
import { Row, Col, Alert,  } from 'antd';
import { Link, useParams } from "react-router-dom";
import { LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import Service from './service';
import { useAuth } from './context_auth';
import PostPanel from './post_panel';
import UserPanel from './user_panel';

const { Title, Paragraph, Text } = Typography;

const Network = () => {
  const {user: currentUser} = useAuth();
  const {username} = useParams();
  const [details, setDetails] = useState(null);

  const handleReload = async () => {
    setDetails(null);
    const r = await Service.get_user_info(username, currentUser);
    r.username = username;
    setDetails(r);
  };

  useEffect(() => {
    if(details === null || details.username !== username)
      handleReload();
  });
  
  if(details === null) return (
    <div style={{width: '900px', margin: '20px'}}>
      <Skeleton avatar paragraph={{ rows: 4 }} />
    </div>
  );

  return (
    <div style={{width: '900px', margin: '20px'}}>
      <Row>
        <Col span={8}>
          <Card
            size = "large"
            title={username}
          >
            <Paragraph
              style={{ fontSize: '16px' , margin:-5}}
            >
              <Title level={2}>{details.nick}</Title>
              <p>E-mail: {details.email}</p>
            </Paragraph>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Followers"
            style={{margin: "0px 10px"}}
            bodyStyle={{ padding: '0px' }}
          >
            {
              details.followers.length <= 1 ? (
                <Empty />
              ) : (
                <UserPanel
                  hideUsername
                  excludes={[username]}
                  results={details.followers}
                  setResults={followers => {
                      details.followers = followers;
                      setDetails(details);
                  }}
                />
              )
            }
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Following"
            bodyStyle={{ padding: '0px' }}
          >
            {
              details.following.length <= 1 ? (
                <Empty />
              ) : (
                <UserPanel
                  hideUsername
                  excludes={[username]}
                  results={details.following}
                  setResults={following => {
                      details.following = following;
                      setDetails(details);
                  }}
                />
              )
            }
          </Card>
        </Col>
      </Row>
      <PostPanel title={`Posts by ${details.nick}`}
                 onesPosts={details}
                 hideNewPost />
    </div>
  )
}
export default Network;
