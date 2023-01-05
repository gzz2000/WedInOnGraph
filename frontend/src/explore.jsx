import React, { useState } from 'react';
import { List, Space, Layout,Empty, Button, Checkbox, Form, Input, Menu, Typography, Card } from 'antd';
import { PlusOutlined, LoginOutlined, UserOutlined, UsergroupAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
const { Search } = Input;
import { Row, Col, Alert,  } from 'antd';
import { Link } from "react-router-dom";
import { LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Explore = () => {



    return (
        <div>
            <Space
                size={"Large"}
                direction="vertical"
            >
                <Search size="large"
                        placeholder=" Search for people"
                        prefix={<UserOutlined />}
                        allowClear
                        style={{
                            width: 700,
                            margin: 30}}
                        enterButton
                />
                <br/>
                {/**
                 todo: edit the following code:
                    if no user / init state: use "empty";
                    else: use card (NOTE that there will only be 1 card if we search for username)
                 */}
                <Empty
                    style = {{margin: 150}}
                />
                <br/>
                <Card /*title="Person To Follow" */
                    style={{margin: 20,  align:"middle"}}
                    >
                    <List
                        itemLayout="horizontal"
                        dataSource={['gzz3']}
                        renderItem={user =>
                            <List.Item extra={
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<PlusOutlined />}
                                >Follow</Button>
                            } style={{height: 40}}
                            >
                                <div>
                                    <UserOutlined /> <b>{user}</b>
                                </div>
                            </List.Item>
                        }
                    />
                </Card>

            </Space>
        </div>
    )
}
export default Explore;
