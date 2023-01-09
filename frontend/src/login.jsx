import React, { useState } from 'react';
import { Layout, Button, Checkbox, Form, Input, Menu, Typography, Card } from 'antd';
import { LoginOutlined, UserOutlined, UsergroupAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Service from './service';

const LoginForm = () => {

  const navigate = useNavigate();

  const HandleLogin = (values) => {
    Service.Login(values)
    .then(response => {
      alert("Log in successfully.");
      navigate("/network");
      window.location.reload();
    })
    .catch(response => {
      alert("Log in failed.");
    })
  }

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{ marginTop: '20px' }}
      onFinish={ HandleLogin }
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
  
  const navigate = useNavigate();

  const HandleRegister = (values) => {
    Service.Register(values)
    .then(response => {
      alert("Register successfully.");
      navigate("/network");
      window.location.reload();
    })
    .catch(response => {
      alert("Register failed.");
    })
  }

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{ marginTop: '20px' }}
      onFinish={ HandleRegister }
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
          hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
          label="Confirm"
          name="password2"
          rules={[
            {
              required: true,
              message: 'Please type password again to confirm it',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match'));
              },
            }),
          ]}
          hasFeedback
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
    <Card title="Log in or sign up to continue" style={{margin: '20px'}}>
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
