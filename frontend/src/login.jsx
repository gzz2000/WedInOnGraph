import React, { useState } from 'react';
import { Layout, Button, Checkbox, Form, Input, Menu, Typography, Card, message, Alert } from 'antd';
import { LoginOutlined, UserOutlined, UsergroupAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Service from './service';
import { useAuth } from './context_auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const {user, setUser} = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      let u = await Service.login({
        username: form.getFieldValue('username'),
        password: form.getFieldValue('password'),
        remember: form.getFieldValue('remember'),
      });
      message.success(`Welcome back, ${u.username}.`);
      setUser(u);
      navigate('/');
    }
    catch(e) {}
    setLoading(false);
  };

  return (
    <Form
      form={form}
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
        <Button type="primary" onClick={handleLogin} loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  )
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const {user, setUser} = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      let u = await Service.register({
        username: form.getFieldValue('username'),
        password: form.getFieldValue('password'),
        email: form.getFieldValue('email'),
        nick: form.getFieldValue('nick'),
      });
      message.success(`Welcome, ${u.username}. You have successfully registered.`);
      setUser(u);
      navigate('/');
    }
    catch(e) {}
    setLoading(false);
  };

  return (
    <Form
      form={form}
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
          label="Nickname"
          name="nick"
          rules={[{ required: true, message: 'Please choose a nickname' }]}
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
          label="Confirm"
          name="password2"
          rules={[
            { required: true, message: 'Please type password again to confirm it' },
            ({ getFieldValue }) => ({
              async validator(_, value) {
                if(value && getFieldValue('password') !== value) {
                  throw new Error('The two passwords that you entered do not match.');
                }
              }
            })
          ]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>
      
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={handleRegister} loading={loading}>
          Register Now
        </Button>
      </Form.Item>
    </Form>
  )
};

const Login = () => {
  const [onRegister, setOnRegister] = useState(true);
  const {user} = useAuth();
  return (
    <Card title="Log in or sign up to continue" style={{margin: '20px'}}>
      { user !== null ? (
          <Alert message={`You are already logged in as ${user.username}. Continuing will log you out of current account.`} type="info" showIcon />
      ) : null }
      <Menu
        mode="horizontal"
        selectedKeys={[onRegister ? 'register' : 'login']}
        onClick={
          e => {
            if(e.key === 'register') setOnRegister(true);
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
    </Card>
  )
};

export default Login;
