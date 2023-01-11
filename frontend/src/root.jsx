import React, { useState, useEffect } from 'react';
import './index.css';
import { Breadcrumb, Layout, Menu, Input, Row, Col, Dropdown, message } from 'antd';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import Service from './service';
import { useAuth } from './context_auth';

const Root = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', background: 'white' }}>
        <div className="logo">Logo Required</div>
        <Row justify="space-between">
          <Col style={{width: '400px'}}>
            <Menu
              mode="horizontal"
              items={[
                {key: '/', label: 'Home'},
                {key: '/explore', label: 'Explore'},
                {key: '/search_user', label: 'Search User'},
              ]}
              onClick={
                (item) => {
                  navigate(item.key, {replace: true})
                }
              }
              selectedKeys={location.pathname}
            />
          </Col>
          <Col>
            {
              user === null ? (
                <Link to="/login">
                  Login
                </Link>
              ) : (
                <Dropdown menu={{
                  items: [
                    {
                      key: 'logout',
                      label: 'Logout',
                      icon: <LogoutOutlined />,
                      onClick: () => {
                        logout();
                        message.info('Logout succeeded.');
                      }
                    }
                  ]
                }}>
                  <Link to="/network">
                    <UserOutlined /> {user.username}
                  </Link>
                </Dropdown>
              )
            }
          </Col>
        </Row>
      </Header>
      <Content className="layout-content">
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>© 2022 The WedIn (Weibo + LinkedIn) Project. Frontend: React/Ant-Design. Backend: Python/GStore.</Footer>
    </Layout>
  );
};

export default Root;
