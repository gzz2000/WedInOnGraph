import React, { useState } from 'react';
import { Layout, Button, Checkbox, Form, Input, Menu, Typography } from 'antd';
import { LoginOutlined, UserOutlined, UsergroupAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const LoginForm = () => {
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{ marginTop: '20px' }}
    >
      <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input username' }]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>
      
      <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input password' }]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
      
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  )
};

const RegisterForm = () => {
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{ marginTop: '20px' }}
    >
      <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input username' }]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>
      
      <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, message: 'Please input email' }]}
      >
        <Input prefix={<MailOutlined />} />
      </Form.Item>
      
      <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input password' }]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>
      
      <Form.Item
          label="Confirm password"
          name="password2"
          rules={[{ required: true, message: 'Please type password again to confirm it' }]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>
      
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Register Now
        </Button>
      </Form.Item>
    </Form>
  )
};

const Login = () => {
  const [onRegister, setOnRegister] = useState(true);
  return (
    <div className="login-box">
      <Menu
        mode="horizontal"
        selectedKeys={[onRegister ? 'register' : 'login']}
        onClick={
          e => {
            if(e.key == 'register') setOnRegister(true);
            else setOnRegister(false);
          }
        }
        items={[
          {
            label: 'Register',
            key: 'register',
            icon: <UsergroupAddOutlined />,
          },
          {
            label: 'Login',
            key: 'login',
            icon: <LoginOutlined />,
          }
        ]} />
      <Typography.Paragraph style={{margin: '10px'}}>
        {
          onRegister ? <>
            Already have an account? <a onClick={() => setOnRegister(false)}>Click to login</a>.
          </> : <>
            Do not have account yet? <a onClick={() => setOnRegister(true)}>Click to register</a>.
          </>
        }
      </Typography.Paragraph>
      { onRegister ? <RegisterForm /> : <LoginForm /> }
    </div>
  )
};

export default Login;
