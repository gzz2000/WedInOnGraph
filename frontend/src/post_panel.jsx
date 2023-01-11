import React, { useState, useEffect } from 'react';
import { Space, Card, Row, Col, Skeleton, Typography, Button, Input, List, message, Popconfirm, Empty } from 'antd';
import { ReloadOutlined, UserOutlined, LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context_auth';
import Service from './service';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const time2date = time => {
  const date = new Date(time * 1000);
  return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
}

const PostPanel = ({ isFollowedPosts, onesPosts, hideNewPost, title }) => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newpost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [thumbuping, setThumbuping] = useState(null);

  const handleReload = async () => {
    setLoading(true);
    if(isFollowedPosts) {
      let posts = await Service.list_followed_posts(10, 0, user);
      setPosts(posts);
    }
    else if(onesPosts) {
      let posts = await Service.list_ones_posts(onesPosts.username, 10, 0);
      for(const post of posts) {
        post.author = onesPosts.username;
        post.authornick = onesPosts.nick;
      }
      setPosts(posts);
    }
    else {
      let posts = await Service.list_all_posts(10, 0);
      setPosts(posts);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    handleReload();
  }, []);

  const handlePost = async () => {
    if(newpost == '') return;
    setPosting(true);
    try {
      await Service.add_post(newpost, user);
      message.success('Published successfully.');
      handleReload();
      setNewPost('');
    }
    catch(e) {}
    setPosting(false);
  };

  const handleDelete = async postid => {
    setDeleting(postid);
    await Service.delete_post(postid, user);
    message.success('Post deleted.');
    setPosts(posts.filter(({postid: p}) => p != postid));
    setDeleting(null);
  }

  const handleThumbup = async postid => {
    if(user === null) {
      message.info('Please log in first.');
      navigate('/login');
      return;
    }
    setThumbuping(postid);
    const post = posts.find(({postid: p}) => p == postid);
    console.log('post:', post)
    const orig_idx = post.thumbups.findIndex(({username}) => username == user.username);
    if(orig_idx >= 0) {
      await Service.remove_thumbup(postid, user);
      post.thumbups.splice(orig_idx, 1);
    }
    else {
      await Service.add_thumbup(postid, user);
      post.thumbups.push({username: user.username, nick: user.nick});
    }
    setPosts(posts);
    setThumbuping(null);
  };

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ width: '100%' }}
    >
      { user !== null && !hideNewPost ? (
          <Card
            bodyStyle={{ padding: '0px' }}
            >
            <Row style={{ width: '100%' }}>
              <Col span={20}>
                <TextArea
                  bordered={false}
                  style={{ padding: '15px', fontSize: '16px' }}
                  autoSize={{ minRows: 2 }}
                  placeholder="Say something..."
                  value={newpost}
                  onChange={e => setNewPost(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Button
                  type="link"
                  icon={<SendOutlined />}
                  style={{ width: '100%', height: '100%' }}
                  loading={posting}
                  onClick={handlePost}
                >
                  Post
                </Button>
              </Col>
            </Row>
          </Card>
      ) : null
      }
      <Title level={3}>
        {title}
        <Button
          type="link"
          icon={<ReloadOutlined />}
          onClick={handleReload}
        >Refresh</Button>
      </Title>
      { loading ? (
      <Skeleton avatar paragraph={{ rows: 4 }} />
      ) : (
        posts.length ?
        posts.map(({ postid, author, authornick, content, time, thumbups }) => (
          <Card
            key={`panelpost__${postid}`}
            size="small"
            type="inner"
            title={<><UserOutlined /> <Link to={`/network/${author}`}>{authornick}</Link> {user && author === user.username ? '(you)' : null} </>}
            extra={
              [
                (user !== null && author === user.username) ? (
                  <Popconfirm
                    title="Delete the post"
                           description="Are you sure to delete this post permanently?"
                           onConfirm={() => handleDelete(postid)}
                           disabled={postid == deleting}
                           okTest="Yes, delete it."
                           cancelText="No"
                    >
                    <Button
                      danger={true}
                             loading={postid == deleting}
                             style={{ margin: "-4px -15px", marginRight: '1px' }}
                             type="link"
                             icon={<DeleteOutlined />}
                    >Delete</Button>
                  </Popconfirm>
                ) : null,
                <span>{time2date(time)}</span>
              ]
            }
          >
            <Paragraph
              style={{ fontSize: '16px' }}
            >
              {content}
            </Paragraph>

            <div style={{ marginBottom: '-8px', marginLeft: '-8px' }}>
              <Button
                type="text"
                icon={
                  (user !== null && thumbups.find(({username}) => username == user.username))
                  ? <LikeFilled /> : <LikeOutlined />
                }
                loading={thumbuping == postid}
                onClick={() => handleThumbup(postid)}
              />
              { thumbups.map(({username, nick}) => (
                <><Link to={`/network/${username}`}>{nick}</Link>{
                  (user !== null && user.username == username)
                  ? ' (you)' : null
                }. </>
              )) }
            </div>
          </Card>
        ))
        : <Empty />
      )}
    </Space>
  );
};

export default PostPanel;
