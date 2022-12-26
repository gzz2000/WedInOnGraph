import React from 'react';
import './index.css';
import { Breadcrumb, Layout, Menu, Input } from 'antd';
import { Outlet } from 'react-router-dom';
const { Header, Content, Footer } = Layout;

const Root = () => {
  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <div className="logo"></div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          items={[
            {key: 'home', label: 'Home'},
            {key: 'network', label: 'My Network'},
            {key: 'explore', label: 'Explore'}
          ]}
        />
      </Header>
      <Content className="layout-content">
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>© 2022 The WedIn (Weibo + LinkedIn) Project. Frontend: React/Ant-Design. Backend: Python/GStore.</Footer>
    </Layout>
  );
};

export default Root;
