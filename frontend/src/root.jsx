import React from 'react';
import './index.css';
import { Breadcrumb, Layout, Menu, Input, Row, Col, Dropdown } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;

const Root = () => {
    const navigate = useNavigate()
  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', background: 'white' }}>
        <div className="logo">Logo Required</div>
        <Row justify="space-between">
          <Col>
            <Menu
              mode="horizontal"
              items={[
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
            <Dropdown menu={{
              items: [
                {
                  key: 'logout',
                  label: 'Logout',
                  icon: <LogoutOutlined />,
                }
              ]
            }}>
              <a onClick={e => e.preventDefault()}>
                <UserOutlined /> gzz
              </a>
            </Dropdown>
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
