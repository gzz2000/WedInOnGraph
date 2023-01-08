import React, { useState, useEffect } from 'react';
import './index.css';
import { Breadcrumb, Layout, Menu, Input, Row, Col, Dropdown } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import Service from './service';

const Root = () => {
  const [user, setUser] = useState("Guest");
  useEffect(() => {
    const currentUser = Service.getCurrentUser();
    if (currentUser) setUser(currentUser);
  })
  const navigate = useNavigate();
  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', background: 'white' }}>
        <div className="logo">Logo Required</div>
        <Row justify="space-between">
          <Col>
            <Menu
              mode = "horizontal"
              items = {[
                {key: '/', label: 'Home'},
                {key: '/network', label: 'My Network'},
                {key: '/explore', label: 'Explore'}
              ]}
              onClick = {
                (item) => {
                    navigate(item.key, {replace: true})
                }
            }
            />
          </Col>
          <Col>
          {
            user == "Guest" ? 
            <Dropdown menu={{
              items: [
                {
                  key: 'login',
                  label: 'Login',
                  icon: <LoginOutlined />,
                  onClick: () => { navigate("/login"); }
                }
              ]
            }}>
              <a href = "/network">
                <UserOutlined /> {user}
              </a>
            </Dropdown>
            : <Dropdown menu={{
              items: [
                {
                  key: 'logout',
                  label: 'Logout',
                  icon: <LogoutOutlined />,
                  onClick: () => { Service.Logout(); window.location.reload();}
                }
              ]
            }}>
              <a href = "/network">
                <UserOutlined /> {user}
              </a>
            </Dropdown>
          }
          </Col>
        </Row>
      </Header>
      <Content className="layout-content">
        <Outlet /* contents of children(home & login) */ />
      </Content>
      <Footer style={{ textAlign: 'center' }}>© 2022 The WedIn (Weibo + LinkedIn) Project. Frontend: React/Ant-Design. Backend: Python/GStore.</Footer>
    </Layout>
  );
};

export default Root;
