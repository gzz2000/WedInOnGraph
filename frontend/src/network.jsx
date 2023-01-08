import React, { useState, useEffect } from 'react';
import { List, Space, Layout,Empty, Button, Checkbox, Form, Input, Menu, Typography, Card } from 'antd';
import { CloseOutlined, MinusOutlined, EditOutlined, PlusOutlined, LoginOutlined, UserOutlined, UsergroupAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
const { Search } = Input;
import { Row, Col, Alert,  } from 'antd';
import { Link } from "react-router-dom";
import { LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import Service from './service';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Network = () => {
    const [username, setUsername] = useState("Hello, visitor");
    const [email, setEmail] = useState("Fail to get email address... QAQ");
    useEffect(() => {
        const currentUser = Service.getCurrentUser();
        if (currentUser) {
            setUsername(currentUser);
            Service.getUserEmail(currentUser).then( res => { setEmail(res); } );
        }
    });
    return (
        <div>
            <Card
                size = "large"
                title={username}
                style={{width: 900, margin: 30}}
                extra = {
                    <Button
                        icon={<EditOutlined />}
                    >
                    Edit Introduction
                    </Button>
                }
            >
                <Paragraph
                    style={{ fontSize: '16px' , margin:-5}}
                >
                    Email: {email}
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