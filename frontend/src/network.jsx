import React, { useState, useEffect } from 'react';
import { List, Space, Layout,Empty, Button, Checkbox, Form, Input, Menu, Typography, Card, Modal } from 'antd';
import { CloseOutlined, MailOutlined, LockOutlined, EditOutlined, PlusOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
const { Search } = Input;
import { Row, Col } from 'antd';
import Service from './service';
import {Follow} from "./utils"

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Network = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [followers, setfFollowers] = useState([]);
    const [followed, setfFollowed] = useState([]);
    useEffect(() => {
        const currentUser = Service.getCurrentUser();
        if (currentUser) {
            setUsername(currentUser);
            Service.getUserEmail(currentUser).then( res => { setEmail(res); } );
            Service.getFollower(currentUser).then( res => { setfFollowers(res); } );
            Service.getFollowed(currentUser).then( res => { setfFollowed(res); } );
        }
    });

    const HandleEditSubmit = (values) => {
        Service.EditInfo(values)
        .then(function (response){
          alert("Update your information successfully.");
        })
        .catch(function (response){
          alert("Update failed.");
        })
    }

    const EditInfoForm = () => {
        return (
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ marginTop: '20px' }}
                onFinish={ HandleEditSubmit }
            >
                <Form.Item
                    label="Username"
                    name="username"
                    initialValue={username}
                >
                    <Input prefix={<UserOutlined />} />
                </Form.Item>
                
                <Form.Item
                    label="E-mail"
                    name="email"
                    initialValue={email}
                >
                    <Input prefix={<MailOutlined />} />
                </Form.Item>
                
                <Form.Item
                    label="Password"
                    name="password"
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                    label="Confirm"
                    name="password2"
                    rules={[
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
                    Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    const HandleEditInfo = () => {
        if(!username)
            Modal.warning({
                title: 'Please log in or register first!',
                icon: <SmileOutlined/>
            });
        else 
            Modal.info({
                title: 'Edit your information and submit',
                content: (
                    <div>
                        <Paragraph>Remain the filed blank to keep the info unchanged.</Paragraph>
                        <EditInfoForm />
                    </div>
                ),
                cancelText: 'Done',
            });
    }

    return (
        <div>
            <Card
                size = "large"
                title={username?username:"Hello, visitor"}
                style={{width: 900, margin: 30}}
                extra = {
                    <Button
                        icon={<EditOutlined />}
                        onClick = {HandleEditInfo}
                    >
                    Edit Information
                    </Button>
                }
            >
                <Paragraph
                    style={{ fontSize: '16px' , margin:-5}}
                >
                    Email: {email?email:"Fail to get email address... QAQ"}
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
                            dataSource={followers}
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
                            dataSource={followed}
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