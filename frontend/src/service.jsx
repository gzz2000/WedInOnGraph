import axios from 'axios';
import { message } from 'antd';
import { forceClearAuth } from './context_auth';

const sendPostRequest = async (url, params) => {
  console.log(url, params)
  let ret;
  try {
    ret = (await axios.post('/api' + url, params)).data;
  }
  catch(e) {
    message.error(e.toString());
    throw e;
  }
  if(ret['success']) return ret['data'];
  else {
    message.error(ret['err']);
    if(ret['relogin']) {
      return await new Promise((res, rej) => {
        setTimeout(() => {
          forceClearAuth();
          window.location.reload();
          rej(ret['err']);
        }, 1000);
      })
    }
    throw ret['err'];
  }
};

const login = async params => {
  return await sendPostRequest('/login', params);
};

const register = async params => {
  return await sendPostRequest('/register', params);
};

const list_followed_posts = async (limit, offset, user) => {
  return await sendPostRequest('/list_followed_posts', {
    limit, offset, token: user.token
  });
};

const list_all_posts = async (limit, offset) => {
  return await sendPostRequest('/list_all_posts', {
    limit, offset
  });
};

const list_ones_posts = async (user, limit, offset) => {
  return await sendPostRequest('/list_ones_posts', {
    user, limit, offset
  });
};

const add_post = async (post, user) => {
  return await sendPostRequest('/add_post', {
    post,
    token: user.token
  });
};

const delete_post = async (postid, user) => {
  return await sendPostRequest('/delete_post', {
    postid,
    token: user.token
  });
};

const set_follow = async (other, user) => {
  return await sendPostRequest('/set_follow', {
    other,
    token: user.token
  });
};

const set_unfollow = async (other, user) => {
  return await sendPostRequest('/set_unfollow', {
    other,
    token: user.token
  });
};

const add_thumbup = async (postid, user) => {
  return await sendPostRequest('/add_thumbup', {
    postid,
    token: user.token
  });
};

const remove_thumbup = async (postid, user) => {
  return await sendPostRequest('/remove_thumbup', {
    postid,
    token: user.token
  });
};

const search_user = async (keyword, user, limit, offset) => {
  return await sendPostRequest('/search_user', {
    keyword, limit, offset,
    ...(user === null ? {} : {token: user.token})
  });
};

const recommend_2_hop = async (me, limit) => {
  return await sendPostRequest('/recommend_2_hop', {
    me, limit
  });
};

const get_user_info = async (username, cur_user) => {
  return await sendPostRequest('/get_user_info', {
    username,
    ...(cur_user === null ? {} : {token: cur_user.token})
  });
};

export default { login, register, list_followed_posts, list_all_posts, list_ones_posts, add_post, delete_post, set_follow, set_unfollow, add_thumbup, remove_thumbup, search_user, recommend_2_hop, get_user_info };
