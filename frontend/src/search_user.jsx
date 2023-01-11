import React, { useState } from 'react';
import { List, Space, Layout,Empty, Button, Checkbox, Form, Input, Menu, Typography, Card, Skeleton, message } from 'antd';
import { PlusOutlined, LoginOutlined, UserOutlined, UsergroupAddOutlined, LockOutlined, MailOutlined, CheckOutlined } from '@ant-design/icons';
const { Search } = Input;
import { Row, Col, Alert,  } from 'antd';
import { Link } from "react-router-dom";
import { LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from './context_auth';
import Service from './service';
import UserPanel from './user_panel';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const SearchUser = () => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async keyword => {
    console.log(keyword);
    setLoading(true);
    try {
      let r = await Service.search_user(keyword, user, 10, 0);
      setResults(r);
    }
    catch(e) {
      setResults([]);
    }
    setLoading(false);
  };
  
  return (
    <div>
      <Space
        direction="vertical"
      >
        <Search size="large"
                placeholder=" Search for people"
                prefix={<UserOutlined />}
                allowClear
                style={{
                  width: '700px',
                  margin: '30px'
                }}
                enterButton
                loading={loading}
                onSearch={handleSearch}
        />
        { loading ? (
            <Skeleton avatar paragraph={{ rows: 4 }} />
        ) : results.length === 0 ? (
            <Empty
              style = {{margin: '150px'}}
            />
        ) : (
            <Card
              style={{margin: '20px',  align:"middle"}}
              >
              <UserPanel results={results} setResults={setResults} />
            </Card>
        )}
        <br/>

      </Space>
    </div>
  )
}
export default SearchUser;
