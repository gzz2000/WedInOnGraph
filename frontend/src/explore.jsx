import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, Button, List, Card, Skeleton, Empty } from 'antd';
import { Link } from "react-router-dom";
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import Service from './service';
import { useAuth } from './context_auth';
import PostPanel from './post_panel';
import UserPanel from './user_panel';

const Explore = () => {
  const {user} = useAuth();

  // copied from Home.
  const [recommends, setRecommends] = useState(null);
  
  const handleRecommendReload = async () => {
    if(user === null) return;
    let r = await Service.recommend_2_hop(user.username, 10);
    for(const u of r) {
      u.note = `${u.nmiddle} follower(s) you know`;
    }
    setRecommends(r);
  }

  useEffect(() => {
    handleRecommendReload();
  }, []);
  
  return (
    <div style={{ width: '1000px' }}>
      <Row style={{ width: '100%' }}>
        <Col span={16} style={{ padding: '20px' }}>
          {user === null &&
           <Alert
             description={
               <>
                 You are exploring all posts on the server
                 as a guest user.&nbsp;
                 <Link to="/login">Log in</Link> to post your own,
                 and see the activity of the people you follow.
               </>
             }
             type="info"
             showIcon
           />
          }
          <PostPanel title="All Posts" />
        </Col>

        <Col span={8} style={{ padding: '20px', paddingLeft: '0px' }}>
          <Card title="Person To Follow" bodyStyle={{ padding: '0px' }}>
            {
              user === null ? (
                <Empty description="Log in to see recommendations" />
              ) : recommends === null ? (
                <Skeleton paragraph={{ rows: 4 }} />
              ) : recommends.length === 0 ? (
                <Empty />
              ) : (
                <UserPanel
                  hideUsername
                  results={recommends}
                  setResults={setRecommends} />
              )
            }
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Explore;
