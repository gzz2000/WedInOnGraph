import React, { useState } from 'react';
import { List, Button, message } from 'antd';
import { UserOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context_auth';
import Service from './service';

const UserPanel = ({ results, setResults, hideUsername, excludes }) => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [followchg, setFollowchg] = useState(null);
  
  const toggleFollow = async other => {
    console.log(other);
    if(user === null) {
      message.info('Please log in first');
      navigate('/login');
      return;
    }
    setFollowchg(other);
    const u = results.find(({username}) => username == other);
    try {
      if(u.following) {
        await Service.set_unfollow(other, user);
        u.following = false;
      }
      else {
        await Service.set_follow(other, user);
        u.following = true;
      }
      setResults(results);
    }
    catch(e) { console.log(e) }
    setFollowchg(null);
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={results}
      renderItem={({username, nick, follower, following, note}) =>
        (excludes && excludes.includes(username)) ? null : (
          <List.Item extra={
            user !== null && user.username === username ?
            <>Yourself&nbsp;</> :
            <Button
              type={following ? 'text' : 'primary'}
                   size="small"
                   icon={!following ? <PlusOutlined /> : <CheckOutlined />}
                   loading={username === followchg}
                            onClick={() => toggleFollow(username)}
              >{following ? "Followed" : "Follow"}</Button>
          }>
            <div>
              <UserOutlined /> <Link to={`/network/${username}`}>{nick}</Link> { hideUsername ? null : <>({username})</>}
              { follower && !(user !== null && user.username === username) ?
                <><br />Following you</> : null }
              { note ? <><br />{note}</> : null }
            </div>
          </List.Item>
        )
      }
    />
  )
}

export default UserPanel;
